import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-zinc-900 text-white mt-16 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1">
            <span className="font-serif text-xl font-bold text-zinc-100">
              Wine Calculator App
            </span>
          </div>
          {/* Здесь можно добавить дополнительные колонки ссылок */}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800 pt-8 text-center text-zinc-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Wine Calculator App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};