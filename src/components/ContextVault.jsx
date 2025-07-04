import React, { useState, useEffect } from 'react';
import { Plus, Copy, Trash2, Search, ChevronDown, ChevronUp, FileText, Save, Download, Upload, Brain, Folder, MessageSquare, Info, Edit2, X, Moon, Sun, Sparkles, Calendar, Tag } from 'lucide-react';

export default function ContextVault() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIDE, setSelectedIDE] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    ide: 'cursor',
    type: 'prompt',
    title: '',
    content: '',
    project: '',
    tags: []
  });
  const [expandedItems, setExpandedItems] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const aiIDEs = [
    { id: 'cursor', name: 'Cursor', instructionFile: '.cursor/rules' },
    { id: 'claude-code', name: 'Claude Code', instructionFile: '.claude/claude.md' },
    { id: 'windsurf', name: 'Windsurf', instructionFile: '.windsurf/rules' },
    { id: 'cline', name: 'Cline', instructionFile: '.cline/instructions.md' },
    { id: 'github-copilot', name: 'GitHub Copilot', instructionFile: '.github/copilot-instructions.md' },
    { id: 'augment-code', name: 'Augment Code', instructionFile: '.augment/instructions' },
    { id: 'trae', name: 'Trae', instructionFile: '.trae/config' },
    { id: 'zed', name: 'Zed', instructionFile: '.zed/settings.json' },
    { id: 'void', name: 'Void', instructionFile: '.void/rules' },
    { id: 'replit-ghostwriter', name: 'Replit Ghostwriter', instructionFile: '.replit' },
    { id: 'codellm', name: 'CodeLLM', instructionFile: '.codellm/config' },
    { id: 'tabnine', name: 'Tabnine', instructionFile: '.tabnine' },
    { id: 'codewhisperer', name: 'CodeWhisperer', instructionFile: '.aws/codewhisperer' },
    { id: 'jetbrains-ai', name: 'JetBrains AI', instructionFile: '.idea/ai-assistant.xml' },
    { id: 'qodo-gen', name: 'Qodo Gen', instructionFile: '.qodo/config' }
  ];

  const itemTypes = [
    { 
      id: 'prompt', 
      name: 'Prompt', 
      icon: MessageSquare, 
      color: 'blue',
      description: 'Reusable prompts for AI assistance',
      gradient: 'from-blue-500 to-indigo-600',
      lightGradient: 'from-blue-400 to-indigo-500',
      darkGradient: 'from-blue-600 to-indigo-700'
    },
    { 
      id: 'memory', 
      name: 'Memory', 
      icon: Brain, 
      color: 'purple',
      description: 'Persistent context like ChatGPT memories',
      gradient: 'from-purple-500 to-pink-600',
      lightGradient: 'from-purple-400 to-pink-500',
      darkGradient: 'from-purple-600 to-pink-700'
    },
    { 
      id: 'workspace', 
      name: 'Workspace Instruction', 
      icon: Folder, 
      color: 'green',
      description: 'Project-specific instructions (e.g., .claude/claude.md)',
      gradient: 'from-green-500 to-emerald-600',
      lightGradient: 'from-green-400 to-emerald-500',
      darkGradient: 'from-green-600 to-emerald-700'
    }
  ];

  useEffect(() => {
    const savedItems = localStorage.getItem('ai-ide-items');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
    
    const savedTheme = localStorage.getItem('context-vault-theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ai-ide-items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('context-vault-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleAddItem = () => {
    if (newItem.title && newItem.content) {
      const item = {
        ...newItem,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        tags: newItem.tags.filter(tag => tag.trim() !== '')
      };
      setItems([item, ...items]);
      setNewItem({
        ide: 'cursor',
        type: 'prompt',
        title: '',
        content: '',
        project: '',
        tags: []
      });
      setIsAddingItem(false);
    }
  };

  const handleDelete = (id) => {
    setItems(items.filter(p => p.id !== id));
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditItem({
      ...item,
      tags: item.tags || []
    });
  };

  const handleSaveEdit = () => {
    if (editItem.title && editItem.content) {
      const updatedItem = {
        ...editItem,
        tags: editItem.tags.filter(tag => tag.trim() !== ''),
        updatedAt: new Date().toISOString()
      };
      if (updatedItem.type !== 'workspace') {
        delete updatedItem.project;
      }
      setItems(items.map(item => 
        item.id === editingId ? updatedItem : item
      ));
      setEditingId(null);
      setEditItem(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditItem(null);
  };

  const handleCopy = async (content, id) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleExpanded = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(items, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `ai-ide-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedItems = JSON.parse(e.target.result);
          setItems([...items, ...importedItems]);
        } catch (err) {
          alert('Invalid file format');
        }
      };
      reader.readAsText(file);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.project && item.project.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesIDE = selectedIDE === 'all' || item.ide === selectedIDE;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    return matchesSearch && matchesIDE && matchesType;
  });

  const getItemTypeInfo = (typeId) => itemTypes.find(t => t.id === typeId) || itemTypes[0];
  const getIDEInfo = (ideId) => aiIDEs.find(ide => ide.id === ideId);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`} style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div className="p-6 pt-8">
      <div className="max-w-7xl mx-auto">
        {/* Premium Header */}
        <div className={`${darkMode ? 'bg-gradient-to-r from-gray-900 to-gray-800 border-gray-700' : 'bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700/50'} rounded-2xl shadow-2xl p-8 mb-8 border`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="relative group">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl shadow-lg flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110">
                  <div className="absolute inset-0 bg-amber-500 rounded-xl opacity-20 blur-xl animate-pulse"></div>
                  <svg className="w-8 h-8 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              
              {/* Title and Tagline */}
              <div>
                <h1 className="text-4xl font-light text-white tracking-wide transition-all duration-300 hover:text-amber-100">
                  Context<span className="font-semibold">Vault</span>
                </h1>
                <p className="text-amber-200/80 text-sm mt-1 tracking-wider uppercase">
                  AI Development Memory System
                </p>
              </div>
            </div>
            
            {/* Right Side Controls */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 group"
                title={darkMode ? "Light Mode" : "Dark Mode"}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-amber-300 group-hover:rotate-180 transition-transform duration-500" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-300 group-hover:rotate-12 transition-transform duration-500" />
                )}
              </button>
              
              {/* Version Badge */}
              <div className="hidden md:flex items-center gap-3">
                <div className="px-4 py-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-full border border-amber-400/30">
                  <span className="text-amber-200 text-xs font-semibold tracking-wider">PRO</span>
                </div>
                <div className="text-slate-400 text-xs font-medium">
                  v1.0.0
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {itemTypes.map(type => {
            const count = items.filter(item => item.type === type.id).length;
            const TypeIcon = type.icon;
            return (
              <div key={type.id} className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg border backdrop-blur-sm`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{type.name}s</p>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mt-1`}>{count}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${darkMode ? type.darkGradient : type.lightGradient} flex items-center justify-center shadow-lg`}>
                    <TypeIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Controls */}
        <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6 mb-8 border backdrop-blur-sm`}>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[280px]">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'} w-5 h-5`} />
                <input
                  type="text"
                  placeholder="Search vault..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 font-medium`}
                  disabled={editingId !== null}
                />
              </div>
            </div>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className={`px-4 py-3 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-medium cursor-pointer`}
              disabled={editingId !== null}
            >
              <option value="all">All Types</option>
              {itemTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            
            <select
              value={selectedIDE}
              onChange={(e) => setSelectedIDE(e.target.value)}
              className={`px-4 py-3 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-medium cursor-pointer`}
              disabled={editingId !== null}
            >
              <option value="all">All IDEs</option>
              {aiIDEs.map(ide => (
                <option key={ide.id} value={ide.id}>{ide.name}</option>
              ))}
            </select>
            
            <button
              onClick={() => setIsAddingItem(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-medium group"
              disabled={editingId !== null}
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Add New
            </button>
            
            <button
              onClick={handleExport}
              className={`flex items-center gap-2 px-5 py-3 ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'} border rounded-xl hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed font-medium`}
              disabled={editingId !== null}
            >
              <Download className="w-5 h-5" />
              Export
            </button>
            
            <label className={`flex items-center gap-2 px-5 py-3 ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'} border rounded-xl hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer font-medium ${editingId !== null ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <Upload className="w-5 h-5" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
                disabled={editingId !== null}
              />
            </label>
          </div>
        </div>

        {/* Add Item Form */}
        {isAddingItem && !editingId && (
          <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8 mb-8 border backdrop-blur-sm`}>
            <h2 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-6`}>Add New Item</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Type</label>
                  <select
                    value={newItem.type}
                    onChange={(e) => setNewItem({...newItem, type: e.target.value})}
                    className={`w-full px-4 py-3 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200`}
                  >
                    {itemTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>IDE</label>
                  <select
                    value={newItem.ide}
                    onChange={(e) => setNewItem({...newItem, ide: e.target.value})}
                    className={`w-full px-4 py-3 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200`}
                  >
                    {aiIDEs.map(ide => (
                      <option key={ide.id} value={ide.id}>{ide.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {newItem.type === 'workspace' && (
                <div className={`p-4 ${darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'} rounded-xl border flex items-start gap-3`}>
                  <div className={`w-10 h-10 ${darkMode ? 'bg-blue-800' : 'bg-blue-100'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Info className={`w-5 h-5 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} />
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                    <p className="font-medium">This will be saved to: <code className={`${darkMode ? 'bg-blue-800' : 'bg-blue-100'} px-2 py-1 rounded text-xs`}>{getIDEInfo(newItem.ide)?.instructionFile}</code></p>
                    <p className={`mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>Workspace instructions define project-specific AI behaviors and context.</p>
                  </div>
                </div>
              )}
              
              <div>
                <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Title</label>
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                  placeholder={
                    newItem.type === 'prompt' ? "e.g., React Component Generator" :
                    newItem.type === 'memory' ? "e.g., Prefers TypeScript with strict mode" :
                    "e.g., E-commerce Project Instructions"
                  }
                  className={`w-full px-4 py-3 ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200`}
                />
              </div>
              
              {newItem.type === 'workspace' && (
                <div>
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Project/Repository Name</label>
                  <input
                    type="text"
                    value={newItem.project}
                    onChange={(e) => setNewItem({...newItem, project: e.target.value})}
                    placeholder="e.g., my-ecommerce-app"
                    className={`w-full px-4 py-3 ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200`}
                  />
                </div>
              )}
              
              <div>
                <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Content</label>
                <textarea
                  value={newItem.content}
                  onChange={(e) => setNewItem({...newItem, content: e.target.value})}
                  placeholder={
                    newItem.type === 'prompt' ? "Paste your reusable prompt here..." :
                    newItem.type === 'memory' ? "Add context the AI should remember (e.g., coding preferences, project details)..." :
                    "Add workspace-specific instructions for this project..."
                  }
                  rows={8}
                  className={`w-full px-4 py-3 ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 font-mono text-sm`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Tags (comma separated)</label>
                <input
                  type="text"
                  value={newItem.tags.join(', ')}
                  onChange={(e) => setNewItem({...newItem, tags: e.target.value.split(',').map(tag => tag.trim())})}
                  placeholder="e.g., react, typescript, testing"
                  className={`w-full px-4 py-3 ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200`}
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleAddItem}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                >
                  <Save className="w-5 h-5" />
                  Save to Vault
                </button>
                <button
                  onClick={() => setIsAddingItem(false)}
                  className={`px-6 py-3 ${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} rounded-xl transition-all duration-200 font-medium`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.length === 0 ? (
            <div className={`col-span-full ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-16 text-center border backdrop-blur-sm`}>
              <div className={`w-20 h-20 ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-gray-100 to-gray-200'} rounded-2xl mx-auto mb-6 flex items-center justify-center`}>
                <FileText className={`w-10 h-10 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              </div>
              <h3 className={`text-xl font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Your vault is empty</h3>
              <p className={`${darkMode ? 'text-gray-500' : 'text-gray-500'} mb-6`}>Start building your AI context library by adding your first item.</p>
              <button
                onClick={() => setIsAddingItem(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                <Plus className="w-5 h-5" />
                Add Your First Item
              </button>
            </div>
          ) : (
            filteredItems.map(item => {
              const typeInfo = getItemTypeInfo(item.type);
              const ideInfo = getIDEInfo(item.ide);
              const TypeIcon = typeInfo.icon;
              const isExpanded = expandedItems[item.id];
              
              return (
                <div
                  key={item.id}
                  className={`group relative ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border backdrop-blur-sm overflow-hidden ${editingId === item.id ? 'ring-2 ring-amber-500' : ''}`}
                >
                  {/* Card Gradient Border */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${typeInfo.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  
                  {editingId === item.id ? (
                    <div className="relative z-10 p-6 space-y-4">
                      <div className="space-y-4">
                        <div>
                          <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Type</label>
                          <select
                            value={editItem.type}
                            onChange={(e) => setEditItem({...editItem, type: e.target.value})}
                            className={`w-full px-4 py-3 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500`}
                          >
                            {itemTypes.map(type => (
                              <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>IDE</label>
                          <select
                            value={editItem.ide}
                            onChange={(e) => setEditItem({...editItem, ide: e.target.value})}
                            className={`w-full px-4 py-3 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500`}
                          >
                            {aiIDEs.map(ide => (
                              <option key={ide.id} value={ide.id}>{ide.name}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Title</label>
                          <input
                            type="text"
                            value={editItem.title}
                            onChange={(e) => setEditItem({...editItem, title: e.target.value})}
                            className={`w-full px-4 py-3 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500`}
                          />
                        </div>
                        
                        {editItem.type === 'workspace' && (
                          <div>
                            <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Project</label>
                            <input
                              type="text"
                              value={editItem.project || ''}
                              onChange={(e) => setEditItem({...editItem, project: e.target.value})}
                              className={`w-full px-4 py-3 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500`}
                            />
                          </div>
                        )}
                        
                        <div>
                          <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Content</label>
                          <textarea
                            value={editItem.content}
                            onChange={(e) => setEditItem({...editItem, content: e.target.value})}
                            rows={6}
                            className={`w-full px-4 py-3 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm`}
                          />
                        </div>
                        
                        <div>
                          <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Tags</label>
                          <input
                            type="text"
                            value={editItem.tags.join(', ')}
                            onChange={(e) => setEditItem({...editItem, tags: e.target.value.split(',').map(tag => tag.trim())})}
                            className={`w-full px-4 py-3 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500`}
                          />
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={handleSaveEdit}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-200 font-medium"
                          >
                            <Save className="w-4 h-4" />
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className={`flex-1 px-4 py-2 ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'} rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium`}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative z-10">
                      {/* Card Header */}
                      <div className="p-6 pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${typeInfo.gradient} flex items-center justify-center shadow-lg`}>
                            <TypeIcon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEdit(item)}
                              className={`p-2 ${darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'} rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100`}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCopy(item.content, item.id)}
                              className={`p-2 ${darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'} rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100`}
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className={`p-2 ${darkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'} rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2 line-clamp-2`}>
                          {item.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 text-xs mb-3">
                          <span className={`px-2 py-1 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'} rounded-full`}>
                            {ideInfo?.name}
                          </span>
                          {item.project && (
                            <span className={`px-2 py-1 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'} rounded-full flex items-center gap-1`}>
                              <Folder className="w-3 h-3" />
                              {item.project}
                            </span>
                          )}
                        </div>
                        
                        {/* Tags */}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {item.tags.slice(0, 3).map((tag, idx) => (
                              <span key={idx} className={`flex items-center gap-1 px-2 py-1 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'} rounded-full text-xs`}>
                                <Tag className="w-3 h-3" />
                                {tag}
                              </span>
                            ))}
                            {item.tags.length > 3 && (
                              <span className={`px-2 py-1 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'} rounded-full text-xs`}>
                                +{item.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                        
                        {/* Content Preview */}
                        <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'} rounded-xl p-4 mb-3`}>
                          <div className={`${isExpanded ? '' : 'line-clamp-3'} text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} font-mono whitespace-pre-wrap`}>
                            {item.content}
                          </div>
                        </div>
                        
                        {item.content.length > 150 && (
                          <button
                            onClick={() => toggleExpanded(item.id)}
                            className={`text-xs ${darkMode ? 'text-amber-400 hover:text-amber-300' : 'text-amber-600 hover:text-amber-700'} flex items-center gap-1 transition-colors`}
                          >
                            {isExpanded ? (
                              <>Show less <ChevronUp className="w-3 h-3" /></>
                            ) : (
                              <>Show more <ChevronDown className="w-3 h-3" /></>
                            )}
                          </button>
                        )}
                      </div>
                      
                      {/* Card Footer */}
                      <div className={`px-6 py-4 ${darkMode ? 'bg-gray-800/30 border-gray-800' : 'bg-gray-50 border-gray-100'} border-t`}>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-4">
                            <span className={`flex items-center gap-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                              <Calendar className="w-3 h-3" />
                              {formatDate(item.createdAt)}
                            </span>
                            {item.updatedAt && (
                              <span className={`flex items-center gap-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                <Sparkles className="w-3 h-3" />
                                Updated
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Copied Notification */}
                      {copiedId === item.id && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-xs rounded-full shadow-lg animate-pulse">
                          Copied!
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        
        {/* Footer */}
        <div className="mt-16 mb-8 text-center">
          <div className={`inline-flex items-center gap-2 text-sm ${darkMode ? 'text-gray-600' : 'text-gray-500'}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg shadow-sm flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="font-medium">Context Vault</span>
            <span className={darkMode ? 'text-gray-700' : 'text-gray-400'}>•</span>
            <span>v1.0.0</span>
            <span className={darkMode ? 'text-gray-700' : 'text-gray-400'}>•</span>
            <span>Your AI Development Memory System</span>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
