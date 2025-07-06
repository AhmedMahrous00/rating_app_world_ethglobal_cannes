'use client';

import {
  MiniKit,
  MiniKitInstallErrorCodes,
  MiniKitInstallErrorMessage,
} from '@worldcoin/minikit-js';
import { useEffect, useState } from 'react';

const appId = 'your-app-id';

export const Versions = () => {
  const [worldAppData, setWorldAppData] = useState<any>(null);
  const [isValidResult, setIsValidResult] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [deviceProperties, setDeviceProperties] = useState<any>(null);

  useEffect(() => {
    setWorldAppData(window?.WorldApp ?? null);
    setUserData(MiniKit.user ?? null);
    setDeviceProperties(MiniKit.deviceProperties ?? null);
  }, []);

  const isValid = () => {
    if (
      typeof window === 'undefined' ||
      typeof window.WorldApp === 'undefined'
    ) {
      return { isValid: false, error: 'window.WorldApp is undefined' };
    }

    try {
      if (MiniKit.commandsValid(window.WorldApp?.supported_commands)) {
        return { isValid: true };
      } else {
        return {
          isValid: false,
          error:
            MiniKitInstallErrorMessage[MiniKitInstallErrorCodes.AppOutOfDate],
        };
      }
    } catch (error) {
      return {
        isValid: false,
        error: 'Something went wrong on version validation',
      };
    }
  };

  const reinstall = () => {
    MiniKit.install(appId);
    const result = isValid();
    setIsValidResult(result);
  };

  useEffect(() => {
    const result = isValid();
    setIsValidResult(result);
  }, [worldAppData]);

  return (
    <div className="grid gap-y-4">
      <h2 className="font-bold text-2xl">Versions</h2>

      <div>
        <p>window.WorldApp:</p>
        <button onClick={reinstall}>Install</button>
        <div className="bg-gray-300 min-h-[100px] p-2">
          <pre
            suppressHydrationWarning
            className="break-all whitespace-break-spaces"
          >
            {JSON.stringify(worldAppData, null, 2)}
          </pre>
        </div>
      </div>

      <div>
        <p>Is versions Valid:</p>

        <div className="bg-gray-300 min-h-[100px] p-2">
          <pre className="break-all whitespace-break-spaces">
            {JSON.stringify(isValidResult, null, 2)}
          </pre>
        </div>
      </div>

      <div>
        <p>MiniKit.user:</p>
        <div className="bg-gray-300 min-h-[100px] p-2">
          <pre className="break-all whitespace-break-spaces">
            {JSON.stringify(userData, null, 2)}
          </pre>
        </div>
      </div>
      <div>
        <p>Device Properties:</p>
        <div className="bg-gray-300 min-h-[100px] p-2">
          <pre className="break-all whitespace-break-spaces">
            {JSON.stringify(deviceProperties, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
