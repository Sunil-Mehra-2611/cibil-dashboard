import React, { useState, useRef } from 'react';
import { Upload, X, FileText, CheckCircle2, AlertCircle, Info, History } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { adminService } from '../../services/api';

interface FileUploadState {
  file1: File | null; // main_file
  file2: File | null; // identity_file
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  message: string;
  result?: {
    records_inserted: number;
    records_failed: number;
    status: string;
  };
}

const FileUpload: React.FC = () => {
  const [uploadState, setUploadState] = useState<FileUploadState>({
    file1: null,
    file2: null,
    progress: 0,
    status: 'idle',
    message: ''
  });

  const file1Ref = useRef<HTMLInputElement>(null);
  const file2Ref = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileNum: 1 | 2) => {
    const file = e.target.files?.[0] || null;
    if (file && !file.name.endsWith('.txt')) {
      alert('Only .txt files are allowed');
      return;
    }
    setUploadState(prev => ({
      ...prev,
      [`file${fileNum}`]: file
    }));
  };

  const removeFile = (fileNum: 1 | 2) => {
    setUploadState(prev => ({
      ...prev,
      [`file${fileNum}`]: null
    }));
    if (fileNum === 1 && file1Ref.current) file1Ref.current.value = '';
    if (fileNum === 2 && file2Ref.current) file2Ref.current.value = '';
  };

  const handleUpload = async () => {
    if (!uploadState.file1 || !uploadState.file2) {
      alert('Please select both files');
      return;
    }

    setUploadState(prev => ({ ...prev, status: 'uploading', progress: 10, message: 'Preparing files...' }));

    try {
      const formData = new FormData();
      formData.append('main_file', uploadState.file1);
      formData.append('identity_file', uploadState.file2);

      setUploadState(prev => ({ ...prev, progress: 30, message: 'Uploading to server...' }));
      
      const response = await adminService.uploadFiles(formData);
      
      setUploadState(prev => ({
        ...prev,
        status: 'success',
        progress: 100,
        message: response.data.message || 'Upload completed successfully',
        result: {
          records_inserted: response.data.records_inserted,
          records_failed: response.data.records_failed,
          status: response.data.status
        }
      }));
    } catch (err: any) {
      setUploadState(prev => ({
        ...prev,
        status: 'error',
        progress: 0,
        message: err.response?.data?.message || err.message || 'Failed to upload files'
      }));
    }
  };

  const historyData = [
    { id: '1', date: '2026-03-18 10:15 AM', file1: 'BUREAU_MAR_A.txt', file2: 'BUREAU_MAR_B.txt', records: '1.2M', status: 'Completed', user: 'Admin' },
    { id: '2', date: '2026-03-11 02:30 PM', file1: 'DAILY_SYNC_A.txt', file2: 'DAILY_SYNC_B.txt', records: '45K', status: 'Completed', user: 'Admin' },
    { id: '3', date: '2026-03-04 09:00 AM', file1: 'BUREAU_FEB_A.txt', file2: 'BUREAU_FEB_B.txt', records: '850K', status: 'Completed', user: 'Admin' },
  ];

  const columns = [
    { header: 'Upload Date', accessorKey: 'date' },
    { 
      header: 'Files', 
      accessorKey: 'file1',
      cell: (info: any) => (
        <div className="text-xs space-y-1">
          <div className="flex items-center text-slate-600"><FileText size={12} className="mr-1" /> {info.row.original.file1}</div>
          <div className="flex items-center text-slate-600"><FileText size={12} className="mr-1" /> {info.row.original.file2}</div>
        </div>
      )
    },
    { header: 'Records', accessorKey: 'records' },
    { 
      header: 'Status', 
      accessorKey: 'status',
      cell: (info: any) => <Badge variant="success">{info.getValue()}</Badge>
    },
    { header: 'Uploaded By', accessorKey: 'user' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Data Upload Center</h1>
          <p className="text-slate-500">Upload pipe-separated CIBIL data files to update the bureau database.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="New Upload" subtitle="Select 2 pipe-separated .txt files for processing">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {/* File 1 */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Bureau Data File (Primary)</label>
                {!uploadState.file1 ? (
                  <div 
                    onClick={() => file1Ref.current?.click()}
                    className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/30 transition-all group"
                  >
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-primary-100 group-hover:text-primary-600 mb-3">
                      <Upload size={24} />
                    </div>
                    <span className="text-sm font-medium text-slate-600">Click to select file</span>
                    <span className="text-xs text-slate-400 mt-1">Pipe-separated .txt</span>
                    <input 
                      type="file" 
                      ref={file1Ref} 
                      className="hidden" 
                      accept=".txt"
                      onChange={(e) => handleFileChange(e, 1)}
                    />
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 shrink-0">
                        <FileText size={20} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium text-slate-900 truncate">{uploadState.file1.name}</p>
                        <p className="text-xs text-slate-500">{(uploadState.file1.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFile(1)}
                      className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>

              {/* File 2 */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Account Details File (Secondary)</label>
                {!uploadState.file2 ? (
                  <div 
                    onClick={() => file2Ref.current?.click()}
                    className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/30 transition-all group"
                  >
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-primary-100 group-hover:text-primary-600 mb-3">
                      <Upload size={24} />
                    </div>
                    <span className="text-sm font-medium text-slate-600">Click to select file</span>
                    <span className="text-xs text-slate-400 mt-1">Pipe-separated .txt</span>
                    <input 
                      type="file" 
                      ref={file2Ref} 
                      className="hidden" 
                      accept=".txt"
                      onChange={(e) => handleFileChange(e, 2)}
                    />
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 shrink-0">
                        <FileText size={20} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium text-slate-900 truncate">{uploadState.file2.name}</p>
                        <p className="text-xs text-slate-500">{(uploadState.file2.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFile(2)}
                      className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Area */}
            {uploadState.status !== 'idle' && (
              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {uploadState.status === 'uploading' && <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse mr-2"></div>}
                    {uploadState.status === 'success' && <CheckCircle2 size={16} className="text-green-500 mr-2" />}
                    <span className="text-sm font-semibold text-slate-700">
                      {uploadState.status === 'uploading' ? 'Uploading and Processing...' : 
                       uploadState.status === 'success' ? 'Upload Complete' : 'Upload Failed'}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-primary-600">{uploadState.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadState.progress}%` }}
                  ></div>
                </div>
                {uploadState.message && (
                  <div className={cn(
                    "mt-4 p-4 rounded-lg text-sm flex flex-col",
                    uploadState.status === 'success' ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
                  )}>
                    <div className="flex items-start">
                      <Info size={18} className="mr-2 shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="font-bold uppercase tracking-widest text-[10px] mb-1">Upload Status</span>
                        <p className="font-medium">{uploadState.message}</p>
                      </div>
                    </div>
                    
                    {uploadState.status === 'success' && uploadState.result && (
                      <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-green-200/50">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Inserted</p>
                          <p className="text-lg font-black">{uploadState.result.records_inserted.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Failed</p>
                          <p className="text-lg font-black">{uploadState.result.records_failed.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Status</p>
                          <Badge variant={uploadState.result.status === 'partial' ? 'warning' : 'success'} className="mt-1">
                            {uploadState.result.status}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <Button 
                variant="primary" 
                size="lg" 
                disabled={!uploadState.file1 || !uploadState.file2 || uploadState.status === 'uploading'}
                onClick={handleUpload}
                isLoading={uploadState.status === 'uploading'}
              >
                Process Data Files
              </Button>
            </div>
          </Card>

          <Card title="Upload History" headerAction={<Button variant="ghost" size="sm" leftIcon={<History size={16} />}>View More</Button>}>
             <Table columns={columns} data={historyData} />
          </Card>
        </div>

        {/* Instructions */}
        <div className="space-y-6">
          <Card title="Instructions" className="bg-primary-600 border-none text-white">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">1</div>
                <p className="text-sm text-primary-50">Ensure both files are in pipe-separated text format (.txt).</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">2</div>
                <p className="text-sm text-primary-50">Maximum file size allowed is 2GB per file.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">3</div>
                <p className="text-sm text-primary-50">Duplicate customer IDs will be updated with the latest information.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">4</div>
                <p className="text-sm text-primary-50">Large files may take several minutes to process.</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white/10 rounded-lg">
              <div className="flex items-center text-sm font-semibold mb-2">
                <AlertCircle size={16} className="mr-2" /> System Status
              </div>
              <p className="text-xs text-primary-100">Database is currently optimized and ready for data ingestion.</p>
            </div>
          </Card>

          <Card title="Quick Stats">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500 font-medium">Storage Used</span>
                  <span className="text-slate-900 font-bold">45.2 GB / 100 GB</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-primary-600 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500 font-medium">Total Records</span>
                  <span className="text-slate-900 font-bold">12.8M</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
