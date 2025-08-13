'use client';

import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';

interface CartItem {
  id: number;
  name: string;
  selectedSize: { name: string; price: number };
  quantity: number;
  totalPrice: number;
  category: string;
}

interface GroupOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
}

export default function GroupOrderModal({ isOpen, onClose, cart }: GroupOrderModalProps) {
  const [roomId, setRoomId] = useState<string>('');
  const [shareLink, setShareLink] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'qr' | 'link'>('qr');

  useEffect(() => {
    if (isOpen) {
      // Generate a unique room ID
      const newRoomId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      setRoomId(newRoomId);
      
      // Generate share link
      const link = `${window.location.origin}/join/${newRoomId}`;
      setShareLink(link);
    }
  }, [isOpen]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      // You could add a toast notification here
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 text-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Start Group Order</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-red-200 text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-red-100 text-sm mt-1">
            Share this with your friends to order together
          </p>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Room Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-green-600">🟢</span>
              <span className="font-medium text-green-800">Room Active</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Room ID: <span className="font-mono">{roomId}</span>
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-4">
            <button
              onClick={() => setActiveTab('qr')}
              className={`flex-1 py-2 text-center font-medium transition-colors ${
                activeTab === 'qr'
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              QR Code
            </button>
            <button
              onClick={() => setActiveTab('link')}
              className={`flex-1 py-2 text-center font-medium transition-colors ${
                activeTab === 'link'
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Share Link
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'qr' && (
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg border inline-block mb-4">
                <QRCode
                  value={shareLink}
                  size={200}
                  level="M"
                  fgColor="#dc2626"
                  bgColor="#ffffff"
                />
              </div>
              <p className="text-sm text-gray-600">
                Scan this QR code to join the group order
              </p>
            </div>
          )}

          {activeTab === 'link' && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg border">
                <p className="text-sm text-gray-600 mb-2">Share this link:</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 text-sm bg-white border border-gray-300 rounded px-3 py-2"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  Share via WhatsApp
                </button>
                <button className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
                  Share via Telegram
                </button>
              </div>
            </div>
          )}

          {/* Current Cart Preview */}
          {cart.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <h3 className="font-medium text-gray-800 mb-2">Current Cart ({cart.length} items)</h3>
              <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">
                      {item.quantity}x {item.name} ({item.selectedSize.name})
                    </span>
                    <span className="font-medium">${item.totalPrice.toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>${cart.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="font-medium text-blue-800 mb-1">How it works:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Friends join using the QR code or link</li>
              <li>• Everyone can add items to the shared cart</li>
              <li>• You can see all items in real-time</li>
              <li>• Place the order when everyone is ready</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
          <button className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition-colors">
            Start Ordering
          </button>
        </div>
      </div>
    </div>
  );
} 