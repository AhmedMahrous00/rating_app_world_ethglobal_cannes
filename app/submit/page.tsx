'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { MiniKit } from '@worldcoin/minikit-js';
import SubmissionContractABI from '../../abi/SubmissionContract.json';
import Link from 'next/link';

const CONTRACT_ADDRESS = '0x9724fbeb6C78F74B9237AdA99EAFf819Da1936Fa';

export default function SubmitPage() {
  const [ipfsHash, setIpfsHash] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ipfsPrefix = 'ipfs://';
  const fullContent = ipfsPrefix + ipfsHash;

  const validateIpfsCid = (hash: string): { isValid: boolean; error?: string } => {
    if (!hash.trim()) {
      return { isValid: false, error: 'IPFS hash is required' };
    }

    if (!hash.startsWith('Qm')) {
      return { isValid: false, error: 'IPFS CIDv0 must start with "Qm"' };
    }

    if (hash.length !== 46) {
      return { isValid: false, error: 'IPFS CIDv0 must be exactly 46 characters' };
    }

    const validChars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    for (const char of hash) {
      if (!validChars.includes(char)) {
        return { isValid: false, error: 'IPFS CIDv0 contains invalid characters (no 0, O, I, l)' };
      }
    }

    return { isValid: true };
  };

  const validation = validateIpfsCid(ipfsHash);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('Installed:', MiniKit.isInstalled());
    e.preventDefault();
    setError('');
    setSubmitted(false);
    setLoading(true);

    if (!MiniKit.isInstalled()) {
      setError('This feature only works inside the World App.');
      setLoading(false);
      return;
    }

    if (!validation.isValid) {
      setError(validation.error || 'Invalid IPFS hash');
      setLoading(false);
      return;
    }

    try {
      const iface = new ethers.Interface(SubmissionContractABI);
      const data = iface.encodeFunctionData('submit', [fullContent]);

      await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: CONTRACT_ADDRESS,
            abi: SubmissionContractABI,
            functionName: 'submit',
            args: [fullContent],
          }
        ],
      });

      setSubmitted(true);
      setIpfsHash('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <Link 
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Home
            </Link>
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Content</h1>
            </div>
            <div className="w-24"></div>
          </div>

          {submitted && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">Content submitted successfully!</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="ipfs-hash" className="block text-sm font-medium text-gray-700 mb-2">
                IPFS Content Hash
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">{ipfsPrefix}</span>
                </div>
                <input
                  id="ipfs-hash"
                  type="text"
                  value={ipfsHash}
                  onChange={(e) => setIpfsHash(e.target.value)}
                  placeholder="QmHash..."
                  className={`block w-full pl-16 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    ipfsHash && !validation.isValid 
                      ? 'border-red-300 bg-red-50' 
                      : ipfsHash && validation.isValid 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-300'
                  }`}
                />
              </div>
              <div className="mt-2">
                {ipfsHash && !validation.isValid && (
                  <p className="text-sm text-red-600 flex items-center">
                    <svg className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {validation.error}
                  </p>
                )}
                {ipfsHash && validation.isValid && (
                  <p className="text-sm text-green-600 flex items-center">
                    <svg className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Valid IPFS CIDv0
                  </p>
                )}
                {!ipfsHash && (
                  <p className="text-sm text-gray-500">
                    Enter the IPFS hash of your content (e.g., QmHash...)
                  </p>
                )}
              </div>
            </div>

            {ipfsHash && (
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-1">Full IPFS URI:</p>
                    <p className="text-sm font-mono text-gray-800 truncate">{fullContent}</p>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(fullContent)}
                    className="ml-2 text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded transition-colors flex-shrink-0"
                    title="Copy to clipboard"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !validation.isValid}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </div>
              ) : (
                'Submit Content'
              )}
            </button>
          </form>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">How it works</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>1. Upload your content to IPFS</p>
                  <p>2. Copy the IPFS hash (must be CIDv0 format)</p>
                  <p>3. Paste it here to submit to the blockchain</p>
                  <div className="mt-2 p-2 bg-blue-100 rounded text-xs">
                    <p className="font-medium">IPFS CIDv0 Format:</p>
                    <p>• Must start with "Qm"</p>
                    <p>• Exactly 46 characters total</p>
                    <p>• Only Base58 characters (no 0, O, I, l)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500 text-center">
            <p>MiniKit installed: {String(MiniKit.isInstalled())}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
