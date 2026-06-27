import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Button } from '../components/ui/Button';
import { formatNumber } from '../utils';
import { audio } from '../audio/sounds';
import { ShoppingBag, Coins, Gem, Sparkles, AlertCircle, Wallet, CreditCard, Copy, Check, Star } from 'lucide-react';

interface CryptoBundle {
  id: string;
  rubies: number;
  priceUSD: number;
  bonus: string;
}

export function Shop() {
  const { inventory } = useGameStore();
  
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [selectedBundle, setSelectedBundle] = useState<CryptoBundle | null>(null);
  const [userTxHash, setUserTxHash] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(false);

  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customRubies, setCustomRubies] = useState(500);
  const [ltcPrice, setLtcPrice] = useState(78.5);
  const [verifying, setVerifying] = useState(false);

  const ltcAddress = 'ltc1q42x40rrzeaslwp4vravr97hsy58yycq8c6t2qx';

  React.useEffect(() => {
    fetch('https://api.coinbase.com/v2/prices/LTC-USD/spot')
      .then(res => res.json())
      .then(data => {
        if (data?.data?.amount) {
          const price = parseFloat(data.data.amount);
          if (price > 0) {
            setLtcPrice(price);
          }
        }
      })
      .catch(() => {});
  }, []);

  const getCustomPriceUSD = (rubies: number) => {
    if (rubies < 200) {
      return parseFloat((rubies * 0.05).toFixed(2));
    }
    if (rubies < 1000) {
      return parseFloat((rubies * 0.043).toFixed(2));
    }
    if (rubies < 5000) {
      return parseFloat((rubies * 0.04).toFixed(2));
    }
    return parseFloat((rubies * 0.03).toFixed(2));
  };

  const activeBundle = isCustomMode 
    ? { id: 'custom', rubies: customRubies, priceUSD: getCustomPriceUSD(customRubies), bonus: 'Custom Plan' } 
    : selectedBundle;

  const rubyBundles: CryptoBundle[] = [
    { id: 'ruby_100', rubies: 100, priceUSD: 4.99, bonus: 'Starter Pack' },
    { id: 'ruby_300', rubies: 300, priceUSD: 12.99, bonus: 'Unlocks BattlePass!' },
    { id: 'ruby_1000', rubies: 1000, priceUSD: 39.99, bonus: '+15% Bonus Shards' },
    { id: 'ruby_5000', rubies: 5000, priceUSD: 149.99, bonus: 'Elite VIP Status' }
  ];

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(ltcAddress);
    setCopiedAddress(true);
    audio.playClick();
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleCryptoPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    const bundle = activeBundle;
    if (!bundle) {
      setErrorMsg('Please select a Ruby bundle or configure a custom plan.');
      return;
    }

    if (!userTxHash.trim()) {
      setErrorMsg('Please enter the transaction hash (TxID/TxHash) for blockchain verification.');
      return;
    }

    setVerifying(true);
    audio.playClick();

    try {
      const response = await fetch(`https://api.blockcypher.com/v1/ltc/main/txs/${userTxHash.trim()}`);
      if (!response.ok) {
        throw new Error('On-chain lookup failed.');
      }
      const txData = await response.json();

      if (txData) {
        const hasLtcAddress = txData.outputs?.some((output: any) => 
          output.addresses?.some((addr: string) => addr.toLowerCase() === ltcAddress.toLowerCase())
        );

        if (!hasLtcAddress) {
          setErrorMsg('The transaction was found but it does not send coins to the merchant address.');
          setVerifying(false);
          return;
        }

        const satoshisSent = txData.outputs
          ?.filter((output: any) => output.addresses?.some((addr: string) => addr.toLowerCase() === ltcAddress.toLowerCase()))
          ?.reduce((sum: number, output: any) => sum + (output.value || 0), 0) || 0;
        
        const ltcSent = satoshisSent / 100000000;
        const usdValue = ltcSent * ltcPrice;

        if (usdValue < bundle.priceUSD * 0.9) {
          setErrorMsg(`Insufficient Litecoin sent. Transaction shows ${ltcSent.toFixed(4)} LTC (~$${usdValue.toFixed(2)} USD), but the selected bundle costs $${bundle.priceUSD} USD.`);
          setVerifying(false);
          return;
        }

        let updatedInventory = { ...inventory };
        const currentRubies = updatedInventory.rubies || 0;
        updatedInventory.rubies = currentRubies + bundle.rubies;

        useGameStore.setState({ inventory: updatedInventory });

        setSuccessMsg(`On-chain transaction verified! Received ${ltcSent.toFixed(4)} LTC ($${usdValue.toFixed(2)} USD). Credited ${bundle.rubies} Rubies.`);
        setSelectedBundle(null);
        setIsCustomMode(false);
        setUserTxHash('');
      }
    } catch (err) {
      try {
        const fallRes = await fetch(`https://api.blockchair.com/litecoin/dashboards/transaction/${userTxHash.trim()}`);
        if (!fallRes.ok) {
          throw new Error('Fallback lookup failed.');
        }
        const blockchairData = await fallRes.json();
        const txObj = blockchairData?.data?.[userTxHash.trim()];
        if (!txObj) {
          throw new Error('Tx details not found.');
        }

        const outputs = txObj.outputs || [];
        const targetedOutputs = outputs.filter((out: any) => out.recipient?.toLowerCase() === ltcAddress.toLowerCase());

        if (targetedOutputs.length === 0) {
          setErrorMsg('The transaction does not send any coins to the merchant address.');
          setVerifying(false);
          return;
        }

        const satoshisSent = targetedOutputs.reduce((sum: number, out: any) => sum + (out.value || 0), 0);
        const ltcSent = satoshisSent / 100000000;
        const usdValue = ltcSent * ltcPrice;

        if (usdValue < bundle.priceUSD * 0.9) {
          setErrorMsg(`Insufficient Litecoin sent. Transaction shows ${ltcSent.toFixed(4)} LTC (~$${usdValue.toFixed(2)} USD), but the bundle costs $${bundle.priceUSD} USD.`);
          setVerifying(false);
          return;
        }

        let updatedInventory = { ...inventory };
        const currentRubies = updatedInventory.rubies || 0;
        updatedInventory.rubies = currentRubies + bundle.rubies;

        useGameStore.setState({ inventory: updatedInventory });

        setSuccessMsg(`On-chain payment verified via Blockchair! Received ${ltcSent.toFixed(4)} LTC. Credited ${bundle.rubies} Rubies.`);
        setSelectedBundle(null);
        setIsCustomMode(false);
        setUserTxHash('');
      } catch (fallErr) {
        setErrorMsg('Blockchain verification failed. If you just broadcasted your transaction, please wait 30-60 seconds for it to sync, then try again.');
      }
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="h-full bg-[#0F0F0F] text-slate-200 flex flex-col overflow-y-auto p-6 md:p-8">
      
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-pink-500" />
            Crypto Ruby Portal
          </h2>
          <p className="text-xs text-zinc-400 mt-1">Acquire valuable Rubies using secure blockchain payments.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-zinc-950 border border-zinc-900 rounded-lg py-1.5 px-3 flex items-center gap-2 text-xs">
            <Coins className="w-3.5 h-3.5 text-yellow-500" />
            <span className="font-mono font-medium text-white">{formatNumber(inventory.gold)}</span>
          </div>
          <div className="bg-zinc-950 border border-zinc-900 rounded-lg py-1.5 px-3 flex items-center gap-2 text-xs">
            <Gem className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-mono font-medium text-white">{formatNumber(inventory.gems)}</span>
          </div>
          <div className="bg-zinc-950 border border-zinc-900 rounded-lg py-1.5 px-3 flex items-center gap-2 text-xs">
            <Star className="w-3.5 h-3.5 text-pink-400" />
            <span className="font-mono font-medium text-white">{formatNumber(inventory.rubies || 0)}</span>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="mb-4 p-3.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 p-3.5 bg-red-950/40 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-pink-400">1. Select Ruby Bundle</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rubyBundles.map((bundle) => (
              <div
                key={bundle.id}
                onClick={() => {
                  audio.playClick();
                  setSelectedBundle(bundle);
                  setIsCustomMode(false);
                }}
                className={`border rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between relative ${(!isCustomMode && selectedBundle?.id === bundle.id) ? 'bg-pink-950/20 border-pink-500 shadow-md shadow-pink-500/10' : 'bg-zinc-950/40 border-zinc-900 hover:border-zinc-850'}`}
              >
                <span className="absolute top-3 right-3 text-[9px] bg-pink-900/50 text-pink-300 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {bundle.bonus}
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="text-pink-400 animate-pulse" size={24} />
                    <span className="text-2xl font-black tracking-tight text-white">{bundle.rubies}</span>
                  </div>
                  <div className="text-xs text-zinc-400">Precious Rubies Bundle</div>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-900 flex justify-between items-center">
                  <span className="text-xs text-zinc-500">Value Package</span>
                  <span className="font-mono font-bold text-pink-300 text-sm">${bundle.priceUSD} USD</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 relative hover:border-zinc-850 transition-all">
            <span className="absolute top-3.5 right-4 text-[9px] bg-indigo-900/50 text-indigo-300 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Flexible Rate
            </span>
            <div className="flex items-center gap-3 mb-4">
              <Star className="text-indigo-400" size={24} />
              <div>
                <h4 className="font-bold text-sm text-white">Custom Ruby Plan Builder</h4>
                <p className="text-[10px] text-zinc-400 mt-0.5">Customize your order size and get dynamic discount tiers automatically.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-450 font-semibold">Rubies to purchase:</span>
                  <span className="font-black text-indigo-300 font-mono text-sm">{customRubies} ⭐</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="10000" 
                  step="50"
                  value={customRubies}
                  onChange={(e) => {
                    audio.playClick();
                    setCustomRubies(parseInt(e.target.value));
                    setIsCustomMode(true);
                    setSelectedBundle(null);
                  }}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-[10px] text-zinc-550 mt-1 font-semibold font-mono">
                  <span>50 Rubies</span>
                  <span>10,000 Rubies</span>
                </div>
              </div>

              <div className="flex items-center justify-between bg-black/40 p-3.5 rounded-xl border border-zinc-900">
                <div>
                  <div className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Dynamically Calculated Cost</div>
                  <div className="text-[10px] text-zinc-550 font-semibold mt-0.5">
                    Tier Rate: {customRubies >= 5000 ? '$0.030' : customRubies >= 1000 ? '$0.040' : customRubies >= 200 ? '$0.043' : '$0.050'} / Ruby
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-black text-white text-base">${getCustomPriceUSD(customRubies).toFixed(2)} USD</div>
                  <div className="text-[10px] text-zinc-550 font-bold">~{((getCustomPriceUSD(customRubies)) / ltcPrice).toFixed(5)} LTC</div>
                </div>
              </div>

              <Button
                className="w-full text-xs font-bold"
                variant={isCustomMode ? 'primary' : 'secondary'}
                onClick={() => {
                  audio.playClick();
                  setIsCustomMode(true);
                  setSelectedBundle(null);
                }}
              >
                {isCustomMode ? 'Custom Plan Selected' : 'Configure Custom Plan'}
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-zinc-950/50 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 mb-4">2. Payment Gateway</h3>
            
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center p-4 bg-black/40 rounded-xl border border-zinc-900">
                <div className="text-[10px] uppercase font-bold text-blue-400 mb-3">Scan Litecoin (LTC) Barcode</div>
                <div className="relative p-2 bg-white rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`litecoin:${ltcAddress}?amount=${activeBundle ? (activeBundle.priceUSD / ltcPrice).toFixed(6) : '0.000000'}`)}`} 
                    alt="Litecoin QR Code" 
                    className="w-[140px] h-[140px]" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-[10px] text-zinc-550 mt-2 font-semibold">Litecoin (LTC) Network</div>
              </div>

              <div className="bg-black/60 rounded-xl p-4 border border-zinc-900 space-y-2">
                <div className="text-[9px] uppercase font-bold text-blue-400">Transfer Address (LTC)</div>
                <div className="font-mono text-[10px] break-all text-white bg-zinc-900 p-2.5 rounded-lg border border-zinc-850 flex items-center justify-between gap-2">
                  <span className="truncate">{ltcAddress}</span>
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="text-zinc-500 hover:text-white p-1"
                  >
                    {copiedAddress ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="flex justify-between items-center text-[10px] text-zinc-550 border-b border-zinc-900 pb-1.5 mt-1">
                  <span>LTC Spot Price:</span>
                  <span className="text-white font-mono font-black">${ltcPrice.toFixed(2)} USD</span>
                </div>
                <p className="text-[10px] text-zinc-500 leading-relaxed">
                  Transfer exactly <span className="text-white font-semibold">${activeBundle ? activeBundle.priceUSD : '0.00'}</span> worth of <span className="text-white font-semibold">LTC</span> (approx. <span className="text-indigo-400 font-black font-mono">{activeBundle ? (activeBundle.priceUSD / ltcPrice).toFixed(6) : '0.000000'} LTC</span>) to the address above.
                </p>
              </div>

              <form onSubmit={handleCryptoPaymentSubmit} className="space-y-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Transaction Hash / TxID</label>
                  <input
                    type="text"
                    placeholder="Paste your transfer transaction hash"
                    value={userTxHash}
                    onChange={(e) => setUserTxHash(e.target.value)}
                    className="w-full bg-black/60 border border-zinc-800 rounded-lg p-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full text-xs font-bold mt-2 flex items-center justify-center gap-1.5"
                  variant={activeBundle && userTxHash && !verifying ? 'primary' : 'secondary'}
                  disabled={!activeBundle || !userTxHash || verifying}
                >
                  {verifying ? (
                    <span className="animate-pulse">Querying Litecoin Blockchain...</span>
                  ) : (
                    <>
                      <CreditCard className="w-3.5 h-3.5" />
                      Verify On-Chain Tx
                    </>
                  )}
                </Button>
              </form>


            </div>
          </div>
          
          <div className="text-[10px] text-zinc-500 text-center leading-relaxed font-semibold">
            Real-time Web3 ledger scanner active. Live queries scan peer-to-peer LTC addresses for matches.
          </div>
        </div>

      </div>

    </div>
  );
}
