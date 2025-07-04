import React, { useState, useEffect } from 'react';
import { Plus, Copy, Trash2, Search, ChevronDown, ChevronUp, FileText, Save, Download, Upload, Brain, Folder, MessageSquare, Info, Edit2, X } from 'lucide-react';

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
      description: 'Reusable prompts for AI assistance'
    },
    { 
      id: 'memory', 
      name: 'Memory', 
      icon: Brain, 
      color: 'purple',
      description: 'Persistent context like ChatGPT memories'
    },
    { 
      id: 'workspace', 
      name: 'Workspace Instruction', 
      icon: Folder, 
      color: 'green',
      description: 'Project-specific instructions (e.g., .claude/claude.md)'
    }
  ];

  useEffect(() => {
    const savedItems = localStorage.getItem('ai-ide-items');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ai-ide-items', JSON.stringify(items));
  }, [items]);

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

  const getTypeColorClasses = (color) => {
    if (color === 'blue') return { bg: 'bg-blue-100', text: 'text-blue-700', icon: 'text-blue-600', gradient: 'from-blue-400 to-blue-600' };
    if (color === 'purple') return { bg: 'bg-purple-100', text: 'text-purple-700', icon: 'text-purple-600', gradient: 'from-purple-400 to-purple-600' };
    return { bg: 'bg-green-100', text: 'text-green-700', icon: 'text-green-600', gradient: 'from-green-400 to-green-600' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div className="p-6 pt-8">
      <div className="max-w-5xl mx-auto">
        {/* Premium Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-t-2xl shadow-2xl p-8 mb-0 border border-slate-700/50">
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
        
        {/* Main Content Area with connected design */}
        <div className="bg-white rounded-b-2xl shadow-lg p-6 mb-6 -mt-1 border-x border-b border-gray-200">
          <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto leading-relaxed">
            Securely store and manage prompts, memories, and workspace instructions across all your AI coding assistants
          </p>
          
          {editingId && (
            <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Edit2 className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-amber-800 font-medium">Currently editing. Please save or cancel your changes to continue.</span>
            </div>
          )}
          
          {/* Type Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {itemTypes.map(type => {
              const TypeIcon = type.icon;
              const colors = getTypeColorClasses(type.color);
              
              return (
                <div key={type.id} className="relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-50 to-transparent rounded-bl-full opacity-50"></div>
                  <div className="relative p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-md`}>
                        <TypeIcon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-800 text-lg">{type.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{type.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex-1 min-w-[280px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search vault..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm font-medium"
                  disabled={editingId !== null}
                />
              </div>
            </div>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm font-medium cursor-pointer"
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
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm font-medium cursor-pointer"
              disabled={editingId !== null}
            >
              <option value="all">All IDEs</option>
              {aiIDEs.map(ide => (
                <option key={ide.id} value={ide.id}>{ide.name}</option>
              ))}
            </select>
            
            <button
              onClick={() => setIsAddingItem(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-medium"
              disabled={editingId !== null}
            >
              <Plus className="w-5 h-5" />
              Add New
            </button>
            
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed font-medium"
              disabled={editingId !== null}
            >
              <Download className="w-5 h-5" />
              Export
            </button>
            
            <label className={editingId !== null ? 'flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg transition-all duration-200 shadow-sm font-medium bg-gray-100 cursor-not-allowed' : 'flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer font-medium'}>
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
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Item</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                  <select
                    value={newItem.type}
                    onChange={(e) => setNewItem({...newItem, type: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                  >
                    {itemTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">IDE</label>
                  <select
                    value={newItem.ide}
                    onChange={(e) => setNewItem({...newItem, ide: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                  >
                    {aiIDEs.map(ide => (
                      <option key={ide.id} value={ide.id}>{ide.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {newItem.type === 'workspace' && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Info className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">This will be saved to: <code className="bg-blue-100 px-2 py-1 rounded text-xs">{getIDEInfo(newItem.ide)?.instructionFile}</code></p>
                    <p className="mt-1 text-blue-700">Workspace instructions define project-specific AI behaviors and context.</p>
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                  placeholder={
                    newItem.type === 'prompt' ? "e.g., React Component Generator" :
                    newItem.type === 'memory' ? "e.g., Prefers TypeScript with strict mode" :
                    "e.g., E-commerce Project Instructions"
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              {newItem.type === 'workspace' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Project/Repository Name</label>
                  <input
                    type="text"
                    value={newItem.project}
                    onChange={(e) => setNewItem({...newItem, project: e.target.value})}
                    placeholder="e.g., my-ecommerce-app"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
                <textarea
                  value={newItem.content}
                  onChange={(e) => setNewItem({...newItem, content: e.target.value})}
                  placeholder={
                    newItem.type === 'prompt' ? "Paste your reusable prompt here..." :
                    newItem.type === 'memory' ? "Add context the AI should remember (e.g., coding preferences, project details)..." :
                    "Add workspace-specific instructions for this project..."
                  }
                  rows={8}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 font-mono text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newItem.tags.join(', ')}
                  onChange={(e) => setNewItem({...newItem, tags: e.target.value.split(',').map(tag => tag.trim())})}
                  placeholder="e.g., react, typescript, testing"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleAddItem}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                >
                  <Save className="w-5 h-5" />
                  Save to Vault
                </button>
                <button
                  onClick={() => setIsAddingItem(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="space-y-6 mt-8">
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-16 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Your vault is empty</h3>
              <p className="text-gray-500 mb-6">Start building your AI context library by adding your first item.</p>
              <button
                onClick={() => setIsAddingItem(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
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
              const colors = getTypeColorClasses(typeInfo.color);
              
              return (
                <div key={item.id} className={editingId === item.id ? 'bg-white rounded-xl shadow-md transition-all duration-300 p-7 ring-2 ring-amber-500 shadow-xl' : 'bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-7'}>
                  {editingId === item.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                          <select
                            value={editItem.type}
                            onChange={(e) => setEditItem({...editItem, type: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                          >
                            {itemTypes.map(type => (
                              <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">IDE</label>
                          <select
                            value={editItem.ide}
                            onChange={(e) => setEditItem({...editItem, ide: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                          >
                            {aiIDEs.map(ide => (
                              <option key={ide.id} value={ide.id}>{ide.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      {editItem.type === 'workspace' && (
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 flex items-start gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Info className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="text-sm text-blue-800">
                            <p className="font-medium">This will be saved to: <code className="bg-blue-100 px-2 py-1 rounded text-xs">{getIDEInfo(editItem.ide)?.instructionFile}</code></p>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                        <input
                          type="text"
                          value={editItem.title}
                          onChange={(e) => setEditItem({...editItem, title: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      
                      {editItem.type === 'workspace' && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Project/Repository Name</label>
                          <input
                            type="text"
                            value={editItem.project || ''}
                            onChange={(e) => setEditItem({...editItem, project: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
                        <textarea
                          value={editItem.content}
                          onChange={(e) => setEditItem({...editItem, content: e.target.value})}
                          rows={8}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 font-mono text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tags (comma separated)</label>
                        <input
                          type="text"
                          value={editItem.tags.join(', ')}
                          onChange={(e) => setEditItem({...editItem, tags: e.target.value.split(',').map(tag => tag.trim())})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={handleSaveEdit}
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                        >
                          <Save className="w-5 h-5" />
                          Save Changes
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
                        >
                          <X className="w-5 h-5" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <TypeIcon className={`w-5 h-5 ${colors.icon}`} />
                            <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className={`px-3 py-1 text-xs rounded-full font-medium inline-flex items-center gap-1.5 ${colors.bg} ${colors.text}`}>
                              <TypeIcon className="w-3.5 h-3.5" />
                              {typeInfo.name}
                            </span>
                            <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium">
                              {ideInfo?.name}
                            </span>
                            {item.project && (
                              <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium inline-flex items-center gap-1.5">
                                <Folder className="w-3.5 h-3.5" />
                                {item.project}
                              </span>
                            )}
                            {item.type === 'workspace' && ideInfo && (
                              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-mono">
                                {ideInfo.instructionFile}
                              </span>
                            )}
                            {item.tags && item.tags.map((tag, idx) => (
                              <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-1.5 ml-4">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
                            title="Edit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleCopy(item.content, item.id)}
                            className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                            title="Copy to clipboard"
                          >
                            <Copy className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => toggleExpanded(item.id)}
                            className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                            title={expandedItems[item.id] ? "Collapse" : "Expand"}
                          >
                            {expandedItems[item.id] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      
                      {copiedId === item.id && (
                        <div className="mb-3 text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-lg inline-block">
                          ✓ Copied to clipboard
                        </div>
                      )}
                      
                      <div className={expandedItems[item.id] ? 'text-gray-700 whitespace-pre-wrap font-mono text-sm bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200' : 'line-clamp-3 text-gray-700 whitespace-pre-wrap font-mono text-sm bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200'}>
                        {item.content}
                      </div>
                      
                      <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Created: {new Date(item.createdAt).toLocaleString()}
                        </span>
                        {item.updatedAt && (
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Updated: {new Date(item.updatedAt).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        
        {/* Footer */}
        <div className="mt-16 mb-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg shadow-sm flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="font-medium">Context Vault</span>
            <span className="text-gray-400">•</span>
            <span>v1.0.0</span>
            <span className="text-gray-400">•</span>
            <span>Your AI Development Memory System</span>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
