import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6 text-stone-800">
      <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
        <h1 className="text-4xl font-serif font-bold text-stone-800 mb-2">404</h1>
        <p className="text-stone-600 mb-6">抱歉，页面未找到</p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800 transition"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

