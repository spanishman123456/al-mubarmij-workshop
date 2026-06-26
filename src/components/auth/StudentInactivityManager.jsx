import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { usePlatform } from "../../context/PlatformContext";
import { InactivityWarningModal } from "./InactivityWarningModal.jsx";
import { flushDraftsBeforeLogout } from "../../lib/draftFlush.js";
import {
  INACTIVITY_CHECK_INTERVAL_MS,
  INACTIVITY_TIMEOUT_MS,
  INACTIVITY_WARNING_MS,
} from "../../lib/inactivityConfig.js";
import {
  bumpLastActivity,
  getLastActivityAt,
  resetActivityTracking,
  signalCrossTabLogout,
  subscribeInactivitySync,
} from "../../lib/inactivitySync.js";

const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "click",
  "keydown",
  "scroll",
  "touchstart",
  "touchmove",
  "wheel",
];

function msUntilLogout(lastActivityAt) {
  return INACTIVITY_TIMEOUT_MS - (Date.now() - lastActivityAt);
}

function shouldShowWarning(lastActivityAt) {
  const remaining = msUntilLogout(lastActivityAt);
  return remaining > 0 && remaining <= INACTIVITY_WARNING_MS;
}

function shouldForceLogout(lastActivityAt) {
  return msUntilLogout(lastActivityAt) <= 0;
}

export function StudentInactivityManager() {
  const { pathname } = useLocation();
  const { isStudentSession, logoutForInactivity } = usePlatform();
  const [warningOpen, setWarningOpen] = useState(false);
  const loggingOutRef = useRef(false);

  const performInactivityLogout = useCallback(async () => {
    if (loggingOutRef.current) return;
    loggingOutRef.current = true;
    setWarningOpen(false);
    await flushDraftsBeforeLogout();
    signalCrossTabLogout();
    logoutForInactivity();
  }, [logoutForInactivity]);

  const onUserActivity = useCallback(() => {
    if (!isStudentSession || loggingOutRef.current) return;
    bumpLastActivity(false);
    setWarningOpen(false);
  }, [isStudentSession]);

  const onContinueSession = useCallback(() => {
    resetActivityTracking();
    setWarningOpen(false);
  }, []);

  const evaluateTimers = useCallback(() => {
    if (!isStudentSession || loggingOutRef.current) return;
    const last = getLastActivityAt();
    if (!last) {
      resetActivityTracking();
      return;
    }
    if (shouldForceLogout(last)) {
      void performInactivityLogout();
      return;
    }
    setWarningOpen(shouldShowWarning(last));
  }, [isStudentSession, performInactivityLogout]);

  useEffect(() => {
    if (!isStudentSession) {
      setWarningOpen(false);
      return;
    }
    resetActivityTracking();
    evaluateTimers();
  }, [isStudentSession, evaluateTimers]);

  useEffect(() => {
    if (!isStudentSession) return;
    bumpLastActivity(true);
  }, [pathname, isStudentSession]);

  useEffect(() => {
    if (!isStudentSession) return;

    ACTIVITY_EVENTS.forEach((name) => {
      window.addEventListener(name, onUserActivity, { passive: true });
    });

    return () => {
      ACTIVITY_EVENTS.forEach((name) => {
        window.removeEventListener(name, onUserActivity);
      });
    };
  }, [isStudentSession, onUserActivity]);

  useEffect(() => {
    if (!isStudentSession) return;
    const interval = setInterval(evaluateTimers, INACTIVITY_CHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isStudentSession, evaluateTimers]);

  useEffect(() => {
    if (!isStudentSession) return;

    return subscribeInactivitySync({
      onActivity: () => {
        if (loggingOutRef.current) return;
        setWarningOpen(false);
        evaluateTimers();
      },
      onLogout: () => {
        if (loggingOutRef.current) return;
        loggingOutRef.current = true;
        setWarningOpen(false);
        void (async () => {
          await flushDraftsBeforeLogout();
          logoutForInactivity();
        })();
      },
    });
  }, [isStudentSession, evaluateTimers, logoutForInactivity]);

  if (!isStudentSession) return null;

  return warningOpen ? (
    <InactivityWarningModal
      onContinue={onContinueSession}
      onLogoutNow={() => {
        void performInactivityLogout();
      }}
    />
  ) : null;
}
