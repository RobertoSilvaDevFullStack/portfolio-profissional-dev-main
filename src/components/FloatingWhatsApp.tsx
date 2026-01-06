import React from 'react';

const FloatingWhatsApp = () => {
  return (
    <a
      href="https://wa.me/5511910835843"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 z-50 group"
      style={{ backgroundColor: '#25D366' }}
      aria-label="Contact me on WhatsApp"
    >
      {/* WhatsApp Official Icon */}
      <svg
        viewBox="0 0 32 32"
        className="w-9 h-9 fill-white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16 0C7.164 0 0 7.163 0 16c0 2.825.738 5.478 2.031 7.778L0 32l8.395-2.191A15.93 15.93 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.455c-2.516 0-4.89-.69-6.915-1.89l-.496-.295-5.15 1.345 1.376-5.025-.324-.513A13.382 13.382 0 012.545 16c0-7.42 6.035-13.455 13.455-13.455S29.455 8.58 29.455 16 23.42 29.455 16 29.455z" />
        <path d="M23.194 19.356c-.397-.199-2.35-1.159-2.714-1.292-.364-.132-.629-.199-.894.199-.265.397-1.026 1.292-1.258 1.557-.232.265-.463.298-.86.1-.397-.2-1.677-.618-3.194-1.972-1.18-1.053-1.977-2.353-2.209-2.75-.232-.397-.025-.612.174-.81.179-.178.397-.463.596-.695.199-.232.265-.397.397-.662.132-.265.066-.497-.033-.695-.1-.199-.894-2.153-1.225-2.947-.323-.773-.651-.668-.894-.68-.232-.011-.497-.013-.762-.013s-.695.1-.06 1.557c.397.397 1.026 1.026 1.026 1.026s1.755 2.682 4.253 3.762c2.498 1.08 2.498.72 2.948.675.45-.045 1.451-.595 1.655-1.169.205-.574.205-1.066.144-1.169-.062-.103-.327-.165-.724-.364z" />
      </svg>

      {/* Pulse Animation */}
      <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: '#25D366' }}></span>
    </a>
  );
};

export default FloatingWhatsApp;