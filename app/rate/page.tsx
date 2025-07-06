'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { MiniKit, VerificationLevel } from '@worldcoin/minikit-js';
import SubmissionContractABI from '../../abi/SubmissionContract.json';
import RatingContractABI from '../../abi/RatingContract.json';
import Link from 'next/link';

const SUBMISSION_STORAGE_ADDRESS = '0x9724fbeb6C78F74B9237AdA99EAFf819Da1936Fa';
const SUBMISSION_RATINGS_ADDRESS = '0xDa29F517a7EbeF9478987b8025653B54E29D3Fc6';

export default function RatingsPage() {
  const [submissions, setSubmissions] = useState<string[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<number | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      const provider = new ethers.JsonRpcProvider('https://worldchain.drpc.org');
      const submissionContract = new ethers.Contract(SUBMISSION_STORAGE_ADDRESS, SubmissionContractABI, provider);
      const count = await submissionContract.submissionCount();
      const list: string[] = [];
      for (let i = 0; i < Number(count); i++) {
        const pointer = await submissionContract.getSubmission(i);
        list.push(pointer);
      }
      setSubmissions(list);
    };

    fetchSubmissions();
  }, []);

  const handleRating = async () => {
    if (selectedSubmission === null || rating < 1 || rating > 5) return;
    setMessage('');

    try {
      const { finalPayload } = await MiniKit.commandsAsync.verify({
        action: 'rate-submission',
        verification_level: VerificationLevel.Orb,
      });

      if (finalPayload.status !== 'success') {
        setMessage('Verification failed or cancelled.');
        return;
      }

      if (!MiniKit.isInstalled()) {
        setMessage('This feature only works inside the World App.');
        return;
      }

      const iface = new ethers.Interface(RatingContractABI);
      const data = iface.encodeFunctionData('rate', [selectedSubmission, rating]);

      await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: SUBMISSION_RATINGS_ADDRESS,
            abi: RatingContractABI,
            functionName: 'rate',
            args: [selectedSubmission, rating],
          }
        ],
      });

      setMessage('Rating submitted successfully.');
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || 'Rating failed');
    }
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link 
          href="/"
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Rate Submissions</h1>
        <div className="w-24"></div>
      </div>
      
      <div className="space-y-4">
        {submissions.map((s, i) => (
          <div key={i} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">#{i + 1}</h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Submission
                  </span>
                </div>
                
                <div className="mb-3">
                  <p className="text-gray-700 text-sm break-all">
                    {s.length > 80 ? `${s.slice(0, 80)}...` : s}
                  </p>
                  {s.length > 80 && (
                    <button
                      onClick={() => navigator.clipboard.writeText(s)}
                      className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                      title="Copy full content"
                    >
                      Copy full content
                    </button>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-500">
                    Click to rate this submission
                  </span>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <button
                  onClick={() => setSelectedSubmission(i)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Rate
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedSubmission !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 shadow-xl">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Rate submission #{selectedSubmission + 1}
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating (click on stars)
              </label>
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-2xl transition-colors ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400`}
                      type="button"
                    >
                      {star <= rating ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {rating > 0 && `(${rating}/5)`}
                </span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleRating}
                disabled={rating < 1 || rating > 5}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex-1"
              >
                Submit Rating
              </button>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors flex-1"
              >
                Cancel
              </button>
            </div>
            
            {message && (
              <div className={`mt-3 p-3 rounded text-sm ${
                message.includes('successfully') 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}