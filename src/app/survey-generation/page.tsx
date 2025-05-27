"use client"

import React from 'react';
import Link from 'next/link';

interface RequirementsData {
  requirements: string[];
  chatId: string;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    toolInvocations?: Array<{
      toolCallId: string;
      toolName: string;
      state: 'call' | 'result';
      args: Record<string, unknown>;
      result?: unknown;
    }>;
  }>;
}

interface RequirementSection {
  title: string;
  icon: string;
  items: string[];
  placeholder: string;
}

export default function SurveyGeneration() {
  const [requirementsData, setRequirementsData] = React.useState<RequirementsData | null>(null);
  const [editingSection, setEditingSection] = React.useState<number | null>(null);
  const [editingItem, setEditingItem] = React.useState<number | null>(null);
  const [editValue, setEditValue] = React.useState('');
  const [newItem, setNewItem] = React.useState('');
  const [addingToSection, setAddingToSection] = React.useState<number | null>(null);
  const [verified, setVerified] = React.useState(false);
  const [sections, setSections] = React.useState<RequirementSection[]>([]);

  // Load requirements data from localStorage on mount
  React.useEffect(() => {
    const savedData = localStorage.getItem('surveyRequirements');
    if (savedData) {
      try {
        const data: RequirementsData = JSON.parse(savedData);
        setRequirementsData(data);
        
        // Parse requirements into sections
        const productInfo: string[] = [];
        const userInfo: string[] = [];
        const surveyGoals: string[] = [];
        
        // Smart categorization based on keywords and context
        data.requirements.forEach(req => {
          const reqLower = req.toLowerCase();
          
          // Product Information keywords
          if (reqLower.includes('product') || reqLower.includes('service') || 
              reqLower.includes('website') || reqLower.includes('company') ||
              reqLower.includes('business') || reqLower.includes('features') ||
              reqLower.includes('pricing') || reqLower.includes('offering')) {
            productInfo.push(req);
          }
          // User/Customer Information keywords
          else if (reqLower.includes('customer') || reqLower.includes('user') || 
                   reqLower.includes('audience') || reqLower.includes('demographic') ||
                   reqLower.includes('target') || reqLower.includes('who')) {
            userInfo.push(req);
          }
          // Survey Goals keywords
          else if (reqLower.includes('survey') || reqLower.includes('feedback') ||
                   reqLower.includes('measure') || reqLower.includes('find out') ||
                   reqLower.includes('discover') || reqLower.includes('goal') ||
                   reqLower.includes('objective') || reqLower.includes('length') ||
                   reqLower.includes('question') || reqLower.includes('topics')) {
            surveyGoals.push(req);
          }
          // Default to survey goals if unclear
          else {
            surveyGoals.push(req);
          }
        });
        
        setSections([
          {
            title: 'Product Information',
            icon: '🏢',
            items: productInfo.length > 0 ? productInfo : ['No product information collected yet'],
            placeholder: 'Add product or service details...'
          },
          {
            title: 'User Information',
            icon: '👥',
            items: userInfo.length > 0 ? userInfo : ['No user information collected yet'],
            placeholder: 'Add customer or user details...'
          },
          {
            title: 'Survey Goals',
            icon: '🎯',
            items: surveyGoals.length > 0 ? surveyGoals : ['No survey goals defined yet'],
            placeholder: 'Add survey objectives or goals...'
          }
        ]);
      } catch (error) {
        console.error('Error parsing requirements data:', error);
      }
    }
  }, []);

  const startEdit = (sectionIndex: number, itemIndex: number, currentValue: string) => {
    setEditingSection(sectionIndex);
    setEditingItem(itemIndex);
    setEditValue(currentValue);
  };

  const saveEdit = () => {
    if (editingSection !== null && editingItem !== null) {
      const newSections = [...sections];
      newSections[editingSection].items[editingItem] = editValue;
      setSections(newSections);
      setEditingSection(null);
      setEditingItem(null);
      setEditValue('');
    }
  };

  const cancelEdit = () => {
    setEditingSection(null);
    setEditingItem(null);
    setEditValue('');
  };

  const deleteItem = (sectionIndex: number, itemIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].items.splice(itemIndex, 1);
    if (newSections[sectionIndex].items.length === 0) {
      newSections[sectionIndex].items = [`No ${newSections[sectionIndex].title.toLowerCase()} collected yet`];
    }
    setSections(newSections);
  };

  const addNewItem = (sectionIndex: number) => {
    if (newItem.trim()) {
      const newSections = [...sections];
      // Remove placeholder if it exists
      if (newSections[sectionIndex].items.length === 1 && 
          newSections[sectionIndex].items[0].includes('No ') && 
          newSections[sectionIndex].items[0].includes(' collected yet')) {
        newSections[sectionIndex].items = [];
      }
      newSections[sectionIndex].items.push(newItem.trim());
      setSections(newSections);
      setNewItem('');
      setAddingToSection(null);
    }
  };

  if (!requirementsData || sections.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-25 to-blue-25 font-serif flex items-center justify-center" style={{background: 'linear-gradient(135deg, #fef7f7 0%, #f0f9ff 100%)'}}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">📝</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Requirements Found</h1>
          <p className="text-gray-600 mb-6">Please complete the requirements gathering chat first.</p>
          <Link 
            href="/create"
            className="bg-gradient-to-r from-pink-400 to-rose-400 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform transition-all hover:scale-105"
          >
            Start Requirements Gathering
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-25 to-blue-25 font-serif" style={{background: 'linear-gradient(135deg, #fef7f7 0%, #f0f9ff 100%)'}}>
      {/* Header */}
      <header className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-300 to-purple-300 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">✨</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Magic Surveys</h1>
          </Link>
          <div className="text-gray-500 font-medium text-sm">
            Requirements Review
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">📋</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Review Your Survey Requirements</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Please review and verify all the information we&apos;ve gathered. You can edit any details to ensure everything is accurate before generating your survey.
            </p>
          </div>

          {/* Requirements Sections */}
          <div className="grid gap-6 mb-8">
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{section.icon}</span>
                      <h2 className="text-xl font-bold text-gray-800">{section.title}</h2>
                    </div>
                    <button
                      onClick={() => setAddingToSection(sectionIndex)}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium px-3 py-1.5 rounded-lg hover:shadow-md transition-all hover:scale-105"
                    >
                      + Add Item
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="group">
                        {editingSection === sectionIndex && editingItem === itemIndex ? (
                          <div className="flex items-center space-x-2">
                            <textarea
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows={2}
                              autoFocus
                            />
                            <button
                              onClick={saveEdit}
                              className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors"
                            >
                              ✓
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
                            <span className={`flex-1 ${item.includes('No ') && item.includes(' collected yet') ? 'text-gray-400 italic' : 'text-gray-800'}`}>
                              {item}
                            </span>
                            {!(item.includes('No ') && item.includes(' collected yet')) && (
                              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => startEdit(sectionIndex, itemIndex, item)}
                                  className="text-blue-500 hover:text-blue-700 p-1"
                                  title="Edit item"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => deleteItem(sectionIndex, itemIndex)}
                                  className="text-red-500 hover:text-red-700 p-1"
                                  title="Delete item"
                                >
                                  🗑️
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Add new item input */}
                    {addingToSection === sectionIndex && (
                      <div className="flex items-center space-x-2 mt-3">
                        <input
                          type="text"
                          value={newItem}
                          onChange={(e) => setNewItem(e.target.value)}
                          placeholder={section.placeholder}
                          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              addNewItem(sectionIndex);
                            } else if (e.key === 'Escape') {
                              setAddingToSection(null);
                              setNewItem('');
                            }
                          }}
                        />
                        <button
                          onClick={() => addNewItem(sectionIndex)}
                          className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => {
                            setAddingToSection(null);
                            setNewItem('');
                          }}
                          className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Verification Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">⚠️</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Verification Required</h3>
                <p className="text-gray-600 mb-4">
                  Please confirm that all the information above is accurate and complete. 
                  This data will be used to generate your survey questions.
                </p>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verified}
                    onChange={(e) => setVerified(e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-gray-700 font-medium">
                    I confirm that all the information above is accurate and complete
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Link 
              href={`/chat/${requirementsData.chatId}`}
              className="bg-gradient-to-r from-gray-400 to-gray-500 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform transition-all hover:scale-105"
            >
              ← Back to Chat
            </Link>
            
            <button
              disabled={!verified}
              onClick={() => {
                if (verified) {
                  alert('Survey generation coming soon! All requirements have been saved.');
                }
              }}
              className={`font-semibold py-4 px-8 rounded-xl shadow-lg transform transition-all ${
                verified 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-xl hover:scale-105 animate-pulse' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              🚀 Generate My Survey
            </button>
          </div>

          {/* Additional Info */}
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              Chat ID: {requirementsData.chatId} • {requirementsData.requirements.length} requirements collected
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 