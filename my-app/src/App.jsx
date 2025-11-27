import React, { useState, useEffect, useRef } from 'react';
import { BadgeCheck, Search, FileText, School, User, Calendar, Shield, ExternalLink, Code, Activity, CheckCircle, AlertCircle, Copy, Check, ChevronDown, ChevronUp, Box, Link as LinkIcon, Fingerprint, Mail, X, Layers, Server, Globe, Database, ArrowRight } from 'lucide-react';

/**
 * MOCK BLOCKCHAIN LOGIC
 */
const mockHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return '0x' + Math.abs(hash).toString(16) + Math.random().toString(16).substr(2, 10);
};

export default function App() {
  const [activeTab, setActiveTab] = useState('issue');
  const [blockchainData, setBlockchainData] = useState({});
  const [logs, setLogs] = useState([]);
  
  // Issuer Form State
  const [studentName, setStudentName] = useState('');
  const [studentID, setStudentID] = useState('');
  const [studentEmail, setStudentEmail] = useState(''); 
  const [lastIssuedEmail, setLastIssuedEmail] = useState(''); 
  const [course, setCourse] = useState('');
  const [institution, setInstitution] = useState('Blockchain Institute of Technology');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastHash, setLastHash] = useState(null);
  const [copied, setCopied] = useState(false);
  const [issueError, setIssueError] = useState(null);

  // Verifier Form State
  const [searchHash, setSearchHash] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [verifyError, setVerifyError] = useState(null);
  const [highlightedBlockHash, setHighlightedBlockHash] = useState(null); 

  // Logic Toggle State
  const [showLogic, setShowLogic] = useState(false);
  
  // Ref for scrolling to blocks
  const blocksContainerRef = useRef(null);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [{ time: timestamp, message, type }, ...prev]);
  };

  const handleCopy = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      addLog('Hash successfully copied to clipboard.', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      addLog('Failed to copy hash automatically.', 'error');
    }
    document.body.removeChild(textArea);
  };

  const handleIssue = (e) => {
    e.preventDefault();
    setIssueError(null);
    setLastHash(null);

    if (!studentName || !course || !studentID || !studentEmail) return;

    // CHECK FOR DUPLICATES
    const existingStudent = Object.values(blockchainData).find(
      record => record.studentID === studentID
    );

    if (existingStudent) {
      setIssueError(`Error: Student ID "${studentID}" already has a credential on the chain.`);
      addLog(`Transaction Rejected: Duplicate Student ID ${studentID}`, 'error');
      return;
    }

    setIsProcessing(true);
    addLog(`Initiating transaction: issueCredential("${studentName}", "${studentID}")...`);

    setTimeout(() => {
      const recordId = mockHash(studentName + studentID + course + Date.now());
      
      const newRecord = {
        studentName,
        studentID,
        studentEmail, // Store email in record
        courseName: course,
        institution,
        issueDate: Date.now(),
        issuer: '0x123...abc',
        isValid: true,
        blockNumber: Object.keys(blockchainData).length + 10245 
      };

      setBlockchainData(prev => ({ ...prev, [recordId]: newRecord }));
      setLastHash(recordId);
      setIsProcessing(false);
      
      addLog(`Transaction Mined! Block #${newRecord.blockNumber}`, 'success');
      addLog(`Event Emitted: CredentialIssued(recordId: ${recordId})`, 'success');
      addLog(`Certificate copy sent to ${studentEmail}`, 'success');

      // Save email for the dialog before clearing
      setLastIssuedEmail(studentEmail);

      // Clear form fields
      setStudentName('');
      setStudentID('');
      setStudentEmail('');
      setCourse('');
      
      if (blocksContainerRef.current) {
        setTimeout(() => {
          blocksContainerRef.current.scrollLeft = blocksContainerRef.current.scrollWidth;
        }, 100);
      }
    }, 2000);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setVerifyError(null);
    setVerificationResult(null);
    setHighlightedBlockHash(null);

    if (!searchHash) return;

    addLog(`Querying blockchain state for ID: ${searchHash}...`);

    setTimeout(() => {
      const record = blockchainData[searchHash];
      if (record) {
        setVerificationResult(record);
        setHighlightedBlockHash(searchHash);
        addLog('Record found and validated.', 'success');
        
        const blockElement = document.getElementById(`block-${searchHash}`);
        if (blockElement) {
          blockElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }

      } else {
        setVerifyError('Credential ID not found on the blockchain.');
        addLog('Query returned null. Invalid ID.', 'error');
      }
    }, 800);
  };

  const blocks = Object.entries(blockchainData).map(([hash, data]) => ({ hash, ...data }));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-blue-300" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Credentia</h1>
              <p className="text-blue-200 text-sm">Ethereum-based Credential Verification System</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2 bg-blue-900/50 px-4 py-2 rounded-full border border-blue-500/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-mono text-blue-100">Network: Sepolia Testnet (Simulated)</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
        
        {/* Left Column: Interactions */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1 flex space-x-1">
            <button 
              onClick={() => setActiveTab('issue')}
              className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center space-x-2 font-medium transition-all ${
                activeTab === 'issue' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <School className="w-5 h-5" />
              <span>University (Issuer)</span>
            </button>
            <button 
              onClick={() => setActiveTab('verify')}
              className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center space-x-2 font-medium transition-all ${
                activeTab === 'verify' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <BadgeCheck className="w-5 h-5" />
              <span>Employer (Verifier)</span>
            </button>
            <button 
              onClick={() => setActiveTab('architecture')}
              className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center space-x-2 font-medium transition-all ${
                activeTab === 'architecture' 
                  ? 'bg-slate-700 text-white shadow-md' 
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <Layers className="w-5 h-5" />
              <span>How it Works</span>
            </button>
          </div>

          {/* Issuer Interface */}
          {activeTab === 'issue' && (
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
              <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-blue-800">Issue New Credential</h2>
                  <span className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded font-mono">Role: Admin</span>
                </div>
              </div>
              
              <div className="p-6">
                <form onSubmit={handleIssue} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Student Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                        <input 
                          type="text" 
                          required
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          placeholder="e.g. John Doe"
                        />
                      </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Student ID (Unique)</label>
                      <div className="relative">
                        <Fingerprint className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                        <input 
                          type="text" 
                          required
                          value={studentID}
                          onChange={(e) => setStudentID(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-sm"
                          placeholder="e.g. CS-2024-001"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Student Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <input 
                        type="email" 
                        required
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="e.g. student@university.edu"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Degree / Certification</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        required
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="e.g. B.Sc Computer Science"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Institution</label>
                    <div className="relative">
                      <School className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Enter Institution Name"
                      />
                    </div>
                  </div>

                  {issueError && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-200 text-sm flex items-start gap-2">
                       <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                       {issueError}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={isProcessing}
                    className={`w-full py-3 rounded-lg font-semibold text-white shadow-md transition-all flex items-center justify-center space-x-2 ${
                      isProcessing 
                        ? 'bg-slate-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <Activity className="w-5 h-5 animate-spin" />
                        <span>Confirming on Blockchain...</span>
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-5 h-5" />
                        <span>Issue Credential</span>
                      </>
                    )}
                  </button>
                </form>

                {lastHash && !isProcessing && (
                  <div className="mt-6 space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-in fade-in slide-in-from-top-4 relative group">
                      {/* Close Button */}
                      <button 
                        onClick={() => setLastHash(null)}
                        className="absolute top-2 right-2 p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full transition-colors"
                        title="Close"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                        <div className="flex-1 overflow-hidden">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-green-800 font-semibold">Successfully Issued!</h3>
                              <p className="text-green-700 text-sm mt-1">
                                The credential has been permanently recorded on the blockchain.
                                <br/>
                                <span className="font-semibold text-green-800 flex items-center gap-1 mt-1 animate-pulse">
                                  <Mail className="w-3 h-3"/> 
                                  Copy sent to: {lastIssuedEmail}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 bg-white border border-green-200 rounded p-2 flex items-center justify-between group">
                            <code className="text-xs text-slate-600 truncate font-mono select-all">
                              {lastHash}
                            </code>
                            <button 
                              onClick={() => handleCopy(lastHash)}
                              className={`text-xs px-2 py-1 rounded ml-2 transition-all flex items-center space-x-1 ${
                                copied 
                                  ? 'bg-green-100 text-green-700 font-bold' 
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                              }`}
                            >
                              {copied ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Verifier Interface */}
          {activeTab === 'verify' && (
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
               <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-emerald-800">Verify Credential</h2>
                <span className="bg-emerald-200 text-emerald-800 text-xs px-2 py-1 rounded font-mono">Public Access</span>
              </div>

              <div className="p-6">
                <form onSubmit={handleVerify} className="flex gap-2 mb-6">
                  <input 
                    type="text" 
                    value={searchHash}
                    onChange={(e) => setSearchHash(e.target.value)}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none font-mono text-sm"
                    placeholder="Enter Credential Hash (0x...)"
                  />
                  <button 
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Verify
                  </button>
                </form>

                {verificationResult && (
                  <div className="bg-white border-2 border-emerald-500/30 rounded-xl p-6 relative overflow-hidden shadow-sm animate-in zoom-in-95 duration-200">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <BadgeCheck className="w-32 h-32 text-emerald-900" />
                    </div>
                    
                    <div className="flex items-center space-x-2 text-emerald-600 font-bold mb-4">
                      <CheckCircle className="w-6 h-6" />
                      <span>Valid Credential Verified</span>
                    </div>

                    <div className="space-y-4 relative z-10">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-semibold">Student Name</p>
                          <p className="text-lg font-medium text-slate-900">{verificationResult.studentName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-semibold">Student ID</p>
                          <p className="text-lg font-medium text-slate-900 font-mono">{verificationResult.studentID}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-semibold">Issue Date</p>
                          <p className="text-lg font-medium text-slate-900">
                            {new Date(verificationResult.issueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-slate-100">
                        <p className="text-xs text-slate-500 uppercase font-semibold">Degree / Certification</p>
                        <p className="text-xl font-bold text-slate-800">{verificationResult.courseName}</p>
                        <p className="text-slate-600">{verificationResult.institution}</p>
                      </div>

                      <div className="pt-4 border-t border-slate-100">
                        <p className="text-xs text-slate-500 uppercase font-semibold">Issuer Signature</p>
                        <p className="text-xs font-mono text-slate-400 break-all">{verificationResult.issuer}</p>
                      </div>
                    </div>
                  </div>
                )}

                {verifyError && (
                   <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3 text-red-700 animate-in shake">
                     <AlertCircle className="w-6 h-6" />
                     <span>{verifyError}</span>
                   </div>
                )}
              </div>
            </div>
          )}

          {/* Architecture/How it Works Tab */}
          {activeTab === 'architecture' && (
             <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-white">System Architecture</h2>
                  <span className="bg-slate-600 text-slate-200 text-xs px-2 py-1 rounded font-mono">DApp Structure</span>
                </div>
                <div className="p-8">
                  <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 relative">
                    {/* Step 1: Frontend */}
                    <div className="flex flex-col items-center text-center max-w-[200px] z-10">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center border-4 border-blue-500 mb-4 shadow-lg">
                        <Globe className="w-10 h-10 text-blue-600" />
                      </div>
                      <h3 className="font-bold text-slate-800">1. Frontend (React)</h3>
                      <p className="text-xs text-slate-500 mt-2">
                        The User Interface you are interacting with right now. It captures data (Name, ID) and prepares it.
                      </p>
                      <div className="mt-2 bg-blue-50 text-blue-700 text-[10px] px-2 py-1 rounded border border-blue-200">
                        Current File: App.jsx
                      </div>
                    </div>

                    {/* Arrow 1 */}
                    <div className="hidden md:flex flex-1 items-center justify-center -mx-4 z-0 opacity-50">
                       <div className="h-0.5 w-full bg-slate-300 relative">
                          <ArrowRight className="absolute right-0 -top-2.5 w-5 h-5 text-slate-400" />
                       </div>
                       <div className="absolute -top-6 text-xs font-mono text-slate-400 bg-white px-2">Transactions</div>
                    </div>

                    {/* Step 2: Smart Contract */}
                    <div className="flex flex-col items-center text-center max-w-[200px] z-10">
                      <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center border-4 border-purple-500 mb-4 shadow-lg">
                        <Code className="w-10 h-10 text-purple-600" />
                      </div>
                      <h3 className="font-bold text-slate-800">2. Smart Contract</h3>
                      <p className="text-xs text-slate-500 mt-2">
                        The "Brain" deployed on the network. It executes the logic (Hashing, Storage) securely.
                      </p>
                      <div className="mt-2 bg-purple-50 text-purple-700 text-[10px] px-2 py-1 rounded border border-purple-200">
                        File: CredentialVerifier.sol
                      </div>
                    </div>

                    {/* Arrow 2 */}
                     <div className="hidden md:flex flex-1 items-center justify-center -mx-4 z-0 opacity-50">
                       <div className="h-0.5 w-full bg-slate-300 relative">
                          <ArrowRight className="absolute right-0 -top-2.5 w-5 h-5 text-slate-400" />
                       </div>
                       <div className="absolute -top-6 text-xs font-mono text-slate-400 bg-white px-2">State Updates</div>
                    </div>

                    {/* Step 3: Blockchain */}
                    <div className="flex flex-col items-center text-center max-w-[200px] z-10">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center border-4 border-green-500 mb-4 shadow-lg">
                        <Database className="w-10 h-10 text-green-600" />
                      </div>
                      <h3 className="font-bold text-slate-800">3. Blockchain Ledger</h3>
                      <p className="text-xs text-slate-500 mt-2">
                        The immutable database (Ethereum/Sepolia). Once data is here, it cannot be deleted or hacked.
                      </p>
                       <div className="mt-2 bg-green-50 text-green-700 text-[10px] px-2 py-1 rounded border border-green-200">
                        Remix VM / Testnet
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-3">
                     <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                     <div>
                       <h4 className="font-semibold text-amber-800 text-sm">Demo Mode Configuration</h4>
                       <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                         Note: To keep the presentation smooth and avoid installing browser wallets like MetaMask right now, 
                         this interface is running in <strong>Simulation Mode</strong>. It uses the exact same logic as the backend, 
                         but simulates the connection so we don't have to wait for block confirmations.
                         <br/><br/>
                         For the <strong>Real-Time Execution</strong>, please refer to the Remix IDE tab where my 
                         <code>CredentialVerifier.sol</code> contract is actively mining blocks.
                       </p>
                     </div>
                  </div>
                </div>
             </div>
          )}

        </div>

        {/* Right Column: Visualizer & Logs (Moved Code to Bottom) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* NEW: Blockchain Visualizer Animation */}
          <div className="bg-slate-900 rounded-xl shadow-lg overflow-hidden border border-slate-700 h-[250px] relative flex flex-col">
             <div className="bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-700 z-10 relative shrink-0">
              <div className="flex items-center space-x-2 text-slate-300">
                <Activity className="w-4 h-4 text-blue-400 animate-pulse" />
                <span className="text-sm font-medium">Live Blockchain Network</span>
              </div>
              <span className="flex items-center space-x-1.5 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] text-green-400 font-mono tracking-wider">SYNCED</span>
              </span>
            </div>

            <div 
              ref={blocksContainerRef}
              className="p-6 h-full w-full overflow-x-auto overflow-y-hidden flex items-center space-x-4 bg-slate-900/50 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
            >
              {/* Genesis Block Placeholder */}
              <div className="flex-shrink-0 flex items-center">
                 <div className="w-24 h-24 rounded-lg bg-slate-800 border-2 border-slate-600 flex flex-col items-center justify-center p-2 opacity-50">
                    <Box className="w-8 h-8 text-slate-500 mb-1" />
                    <span className="text-[10px] text-slate-400 font-mono">GENESIS</span>
                 </div>
                 <div className="w-8 h-0.5 bg-slate-700"></div>
              </div>

              {/* Render Mined Blocks */}
              {blocks.map((block, idx) => {
                const isHighlighted = highlightedBlockHash === block.hash;
                return (
                  <div 
                    key={block.hash} 
                    id={`block-${block.hash}`}
                    className={`flex-shrink-0 flex items-center animate-in slide-in-from-right duration-700 fade-in ${isHighlighted ? 'scale-105' : ''}`}
                  >
                    <div 
                      className={`w-32 h-32 rounded-lg border-2 flex flex-col p-3 relative group transition-all duration-500
                        ${isHighlighted 
                          ? 'bg-amber-500/20 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.5)] z-10' 
                          : 'bg-indigo-900/30 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:scale-105'
                        }
                      `}
                    >
                       <div className={`absolute -top-2 -right-2 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm ${isHighlighted ? 'bg-amber-500 text-black' : 'bg-indigo-500 text-white'}`}>
                         #{block.blockNumber}
                       </div>
                       <div className="flex items-center space-x-1 mb-2">
                         <Box className={`w-4 h-4 ${isHighlighted ? 'text-amber-400' : 'text-indigo-400'}`} />
                         <span className={`text-[10px] font-mono ${isHighlighted ? 'text-amber-300' : 'text-indigo-300'}`}>
                           {isHighlighted ? 'VERIFIED' : 'BLOCK'}
                         </span>
                       </div>
                       <div className="flex-1 flex flex-col justify-center space-y-1">
                          <div className={`w-full h-1 rounded overflow-hidden ${isHighlighted ? 'bg-amber-500/20' : 'bg-indigo-500/20'}`}>
                            <div className={`h-full w-2/3 ${isHighlighted ? 'bg-amber-500 animate-[pulse_1s_ease-in-out_infinite]' : 'bg-indigo-500'}`}></div>
                          </div>
                          <div className={`w-full h-1 rounded overflow-hidden ${isHighlighted ? 'bg-amber-500/20' : 'bg-indigo-500/20'}`}>
                            <div className={`h-full w-1/2 ${isHighlighted ? 'bg-amber-500 animate-[pulse_1.5s_ease-in-out_infinite]' : 'bg-indigo-500'}`}></div>
                          </div>
                       </div>
                       <div className={`mt-2 pt-2 border-t ${isHighlighted ? 'border-amber-500/30' : 'border-indigo-500/30'}`}>
                          <p className={`text-[9px] truncate font-mono ${isHighlighted ? 'text-amber-300' : 'text-indigo-300'}`}>{block.hash}</p>
                       </div>
                    </div>
                    {/* Connection Line */}
                    <div className={`w-8 h-0.5 flex items-center justify-center ${isHighlighted ? 'bg-amber-500/50' : 'bg-indigo-500/50'}`}>
                       <LinkIcon className={`w-3 h-3 ${isHighlighted ? 'text-amber-500' : 'text-indigo-500'}`} />
                    </div>
                  </div>
                );
              })}

              {/* Pending Block Animation */}
              {isProcessing && (
                <div className="flex-shrink-0 flex items-center animate-pulse">
                  <div className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-600 flex flex-col items-center justify-center p-2">
                     <Activity className="w-6 h-6 text-slate-500 animate-spin" />
                     <span className="text-[10px] text-slate-400 font-mono mt-2">MINING...</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Background Grid Effect */}
            <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>
          </div>

          {/* Transaction Logs */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 flex flex-col h-[300px]">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700">Blockchain Events / Logs</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
              {logs.length === 0 && (
                <div className="text-center text-slate-400 mt-10 italic">
                  Waiting for transactions...
                </div>
              )}
              {logs.map((log, i) => (
                <div key={i} className={`p-2 rounded border-l-4 ${
                  log.type === 'success' ? 'border-green-500 bg-green-50' : 
                  log.type === 'error' ? 'border-red-500 bg-red-50' : 
                  'border-blue-400 bg-slate-50'
                }`}>
                  <span className="text-slate-400 mr-2">[{log.time}]</span>
                  <span className={
                    log.type === 'success' ? 'text-green-700' : 
                    log.type === 'error' ? 'text-red-700' : 
                    'text-slate-700'
                  }>{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        
        </div>
      </main>

      {/* FOOTER: Collapsible Smart Contract Logic */}
      <div className="border-t border-slate-200 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20">
        <button 
          onClick={() => setShowLogic(!showLogic)}
          className="w-full flex items-center justify-center space-x-2 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-slate-600 font-medium border-b border-slate-200"
        >
          <Code className="w-4 h-4" />
          <span>{showLogic ? 'Hide Smart Contract Logic' : 'View Smart Contract Logic (Source Code)'}</span>
          {showLogic ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
        
        {showLogic && (
          <div className="bg-slate-900 p-6 animate-in slide-in-from-bottom-5 duration-300">
             <div className="container mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-green-400 font-mono text-sm">CredentialVerifier.sol</h3>
                  <span className="text-xs text-slate-500">Language: Solidity 0.8.0</span>
                </div>
                <div className="overflow-x-auto bg-slate-950 rounded-lg p-4 border border-slate-800">
                <pre className="text-xs font-mono text-slate-300 leading-relaxed">
{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CredentialVerifier {
    
    struct Credential {
        string studentName;
        string courseName;
        string institution;
        uint256 issueDate;
        address issuer;
        bool isValid;
    }

    mapping(bytes32 => Credential) public credentials;

    event CredentialIssued(bytes32 indexed recordId, address indexed issuer);

    function issueCredential(string memory _studentName, string memory _courseName, string memory _institution) public returns (bytes32) {
        
        // 1. Create unique hash from student data + timestamp
        bytes32 recordId = keccak256(abi.encodePacked(_studentName, _courseName, _institution, block.timestamp, msg.sender));

        // 2. Write to Blockchain Storage (Immutable)
        credentials[recordId] = Credential({
            studentName: _studentName,
            courseName: _courseName,
            institution: _institution,
            issueDate: block.timestamp,
            issuer: msg.sender,
            isValid: true
        });

        emit CredentialIssued(recordId, msg.sender);
        return recordId;
    }

    function verifyCredential(bytes32 _recordId) public view returns (string memory, string memory, string memory, uint256, bool) {
        Credential memory c = credentials[_recordId];
        require(c.isValid, "Credential not found.");
        return (c.studentName, c.courseName, c.institution, c.issueDate, c.isValid);
    }
}`}
                  </pre>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}