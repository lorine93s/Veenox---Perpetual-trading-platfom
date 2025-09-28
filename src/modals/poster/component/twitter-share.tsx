import { useState } from "react";
import { FaCopy, FaTwitter } from "react-icons/fa";

type MessageType = {
  message: {
    symbol: string;
    entryPrice: number;
    markPrice: number;
    pnl: number;
    imageUrl: string;
  };
};

const TwitterShareButton = ({ message }: MessageType) => {
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    setShowPreview(true);
  };

  const copyImageToClipboard = async () => {
    try {
      const response = await fetch(message.imageUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie de l"image:', err);
    }
  };

  const shareOnTwitter = () => {
    const tweetText =
      `Trading ${message.symbol} 📊\n` +
      `Entry: $${message.entryPrice}\n` +
      `Current: $${message.markPrice}\n` +
      `PNL: $${message.pnl}\n` +
      `#Trading #Crypto #Veenox`;

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };

  if (!showPreview) {
    return (
      <button
        onClick={handleShare}
        className="mt-4 px-4 py-2 text-sm bg-[#1DA1F2] text-white rounded hover:bg-[#1a91da] transition-colors flex items-center justify-center"
      >
        <FaTwitter className="mr-2" />
        Partager sur Twitter
      </button>
    );
  }

  return (
    <div className="mt-4 p-4 border border-gray-300 rounded-lg">
      <img
        src={message.imageUrl}
        alt="Trade Preview"
        className="w-full mb-4 rounded"
      />
      <div className="flex justify-between">
        <button
          onClick={copyImageToClipboard}
          className="px-4 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center justify-center"
        >
          <FaCopy className="mr-2" />
          {copied ? "Copié !" : "Copier l'image"}
        </button>
        <button
          onClick={shareOnTwitter}
          className="px-4 py-2 text-sm bg-[#1DA1F2] text-white rounded hover:bg-[#1a91da] transition-colors flex items-center justify-center"
        >
          <FaTwitter className="mr-2" />
          Tweeter
        </button>
      </div>
    </div>
  );
};

export default TwitterShareButton;
