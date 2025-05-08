// 'use client'

// import { motion, AnimatePresence } from 'framer-motion';
// import { X, Circle, Plus, Search, Check, Clock, Link as LinkIcon, Orbit, Share2, MoreVertical, HelpCircle, Sun, Moon, Settings, Globe } from 'lucide-react';
// import { useState, useRef } from 'react';

// interface MockPanelProps {
//     isOpen: boolean;
//     onClose: () => void;
// }

// interface Note {
//     id: number;
//     content: string;
//     url: string | null;
//     orbit: string;
//     scope: 'url' | 'global';
//     createdAt: Date;
// }

// export default function MockPanel({ isOpen, onClose }: MockPanelProps) {
//     const [activeTab, setActiveTab] = useState<'notes' | 'tasks'>('notes');
//     const [newNote, setNewNote] = useState('');
//     const [isDarkMode, setIsDarkMode] = useState(true);
//     const [selectedOrbit, setSelectedOrbit] = useState<number | null>(null);
//     const [filterOrbit, setFilterOrbit] = useState<string>('All Orbits');
//     const [filterScope, setFilterScope] = useState<'all' | 'url' | 'global'>('all');
//     const [creationScope, setCreationScope] = useState<'url' | 'global'>('url');
//     const [isOrbitDropdownOpen, setIsOrbitDropdownOpen] = useState(false);
//     const [isScopeDropdownOpen, setIsScopeDropdownOpen] = useState(false);
//     const [currentView, setCurrentView] = useState<'main' | 'memory-map'>('main');
//     const [notes, setNotes] = useState<Note[]>([
//         {
//             id: 1,
//             content: 'Halo helps you capture thoughts and organize them into orbits - like this note about the extension UI',
//             url: 'https://designpatterns.com',
//             orbit: 'Extension Redesign',
//             scope: 'url',
//             createdAt: new Date('2024-03-15')
//         },
//         {
//             id: 2,
//             content: 'Global notes are perfect for ideas that transcend any single page or context',
//             url: null,
//             orbit: 'Ideas',
//             scope: 'global',
//             createdAt: new Date('2024-03-14')
//         },
//         {
//             id: 3,
//             content: 'This documentation page has some great examples of Next.js features we could use',
//             url: 'https://nextjs.org/docs',
//             orbit: 'Documentation',
//             scope: 'url',
//             createdAt: new Date('2024-03-13')
//         },
//         {
//             id: 4,
//             content: 'Remember to review the user feedback from last week',
//             url: null,
//             orbit: 'Ungrouped',
//             scope: 'global',
//             createdAt: new Date('2024-03-12')
//         }
//     ]);
//     const [tasks, setTasks] = useState([
//         { id: 1, content: 'Review project notes', completed: false },
//         { id: 2, content: 'Schedule team meeting', completed: false }
//     ]);
//     const contentEditableRef = useRef<HTMLDivElement>(null);

//     const handleAddNote = () => {
//         if (newNote.trim()) {
//             setNotes([...notes, {
//                 id: Date.now(),
//                 content: newNote,
//                 url: creationScope === 'url' ? 'https://current-page.com' : null,
//                 orbit: 'Ungrouped',
//                 scope: creationScope,
//                 createdAt: new Date()
//             }]);
//             setNewNote('');
//             if (contentEditableRef.current) {
//                 contentEditableRef.current.textContent = '';
//             }
//         }
//     };

//     const toggleTask = (id: number) => {
//         setTasks(tasks.map(task =>
//             task.id === id ? { ...task, completed: !task.completed } : task
//         ));
//     };

//     const toggleDarkMode = () => {
//         setIsDarkMode(!isDarkMode);
//     };

//     const themeClasses = isDarkMode
//         ? 'bg-[#030303] text-white/70 border-white/[0.05]'
//         : 'bg-white text-gray-800 border-gray-200';

//     const themeHoverClasses = isDarkMode
//         ? 'hover:bg-white/[0.03] hover:border-indigo-500/20'
//         : 'hover:bg-gray-50 hover:border-indigo-200';

//     return (
//         <AnimatePresence>
//             {isOpen && (
//                 <>
//                     {/* Backdrop */}
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
//                         onClick={onClose}
//                     />
//                     {/* Panel */}
//                     <motion.div
//                         initial={{ x: '100%' }}
//                         animate={{ x: 0 }}
//                         exit={{ x: '100%' }}
//                         transition={{ type: 'spring', damping: 25, stiffness: 300 }}
//                         className={`fixed right-0 top-0 h-full ${currentView === 'memory-map' ? 'w-[600px]' : 'w-[400px]'} border-l ${themeClasses} z-50`}
//                     >
//                         <div className="p-6 h-full flex flex-col">
//                             {/* Header */}
//                             <div className="flex justify-between items-center mb-6">
//                                 <div className="flex items-center gap-2">
//                                     <Circle className={`w-5 h-5 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-500'}`} strokeWidth={2.5} />
//                                     <h2 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//                                         {currentView === 'memory-map' ? 'Memory Map' : 'Halo'}
//                                     </h2>
//                                 </div>
//                                 <button
//                                     onClick={currentView === 'memory-map' ? () => setCurrentView('main') : onClose}
//                                     className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition-colors`}
//                                 >
//                                     <X className={`w-5 h-5 ${isDarkMode ? 'text-white/50' : 'text-gray-400'}`} />
//                                 </button>
//                             </div>

//                             {currentView === 'main' ? (
//                                 <>
//                                     {/* Search Bar */}
//                                     <div className="relative mb-6">
//                                         <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`} />
//                                         <input
//                                             type="text"
//                                             placeholder="Search your thoughts..."
//                                             className={`w-full pl-10 pr-4 py-2 rounded-lg ${isDarkMode ? 'bg-white/[0.03] border-white/[0.05] text-white/70 placeholder-white/30' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400'} border text-sm focus:outline-none focus:border-indigo-500/30 transition-colors`}
//                                         />
//                                     </div>

//                                     {/* Tabs */}
//                                     <div className="flex gap-2 mb-6">
//                                         <button
//                                             onClick={() => setActiveTab('notes')}
//                                             className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'notes'
//                                                 ? 'bg-indigo-500 text-white'
//                                                 : isDarkMode ? 'text-white/50 hover:text-white' : 'text-gray-500 hover:text-gray-900'
//                                                 }`}
//                                         >
//                                             Notes
//                                         </button>
//                                         <button
//                                             onClick={() => setActiveTab('tasks')}
//                                             className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'tasks'
//                                                 ? 'bg-indigo-500 text-white'
//                                                 : isDarkMode ? 'text-white/50 hover:text-white' : 'text-gray-500 hover:text-gray-900'
//                                                 }`}
//                                         >
//                                             Tasks
//                                         </button>
//                                     </div>

//                                     {/* Content Area */}
//                                     <div className="flex-1 overflow-y-auto">
//                                         {activeTab === 'notes' ? (
//                                             <div className="space-y-4">
//                                                 {/* Filter Bar: Orbit & Scope side by side */}
//                                                 <div className="flex gap-2 mb-4">
//                                                     {/* Orbit Filter */}
//                                                     <div className="relative flex-1">
//                                                         <button
//                                                             onClick={() => setIsOrbitDropdownOpen(!isOrbitDropdownOpen)}
//                                                             className={`w-full px-3 py-1.5 rounded-lg border flex items-center gap-2 text-xs ${isDarkMode ? 'bg-white/[0.03] border-white/[0.05] text-white/70' : 'bg-gray-50 border-gray-200 text-gray-800'} transition-colors`}
//                                                         >
//                                                             <Orbit className="w-4 h-4 opacity-70" />
//                                                             <span className="truncate">{filterOrbit === 'All Orbits' ? 'All Orbits' : filterOrbit}</span>
//                                                             <span className={`ml-auto transform transition-transform ${isOrbitDropdownOpen ? 'rotate-180' : ''}`}>▾</span>
//                                                         </button>
//                                                         {isOrbitDropdownOpen && (
//                                                             <div className={`absolute left-0 right-0 mt-1 py-1 rounded-lg border ${isDarkMode ? 'bg-[#030303] border-white/[0.05]' : 'bg-white border-gray-200'} shadow-lg z-50`}>
//                                                                 <button
//                                                                     onClick={() => {
//                                                                         setFilterOrbit('All Orbits');
//                                                                         setIsOrbitDropdownOpen(false);
//                                                                     }}
//                                                                     className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 ${isDarkMode ? 'text-white/70 hover:bg-white/[0.05]' : 'text-gray-800 hover:bg-gray-50'} transition-colors`}
//                                                                 >
//                                                                     <Orbit className="w-4 h-4 opacity-70" /> All Orbits
//                                                                 </button>
//                                                                 <button
//                                                                     onClick={() => {
//                                                                         setFilterOrbit('Only Ungrouped Notes');
//                                                                         setIsOrbitDropdownOpen(false);
//                                                                     }}
//                                                                     className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 ${isDarkMode ? 'text-white/70 hover:bg-white/[0.05]' : 'text-gray-800 hover:bg-gray-50'} transition-colors`}
//                                                                 >
//                                                                     <Orbit className="w-4 h-4 opacity-70" /> Only Ungrouped Notes
//                                                                 </button>
//                                                                 {Array.from(new Set(notes.map(note => note.orbit))).map((orbit) => (
//                                                                     <button
//                                                                         key={orbit}
//                                                                         onClick={() => {
//                                                                             setFilterOrbit(orbit);
//                                                                             setIsOrbitDropdownOpen(false);
//                                                                         }}
//                                                                         className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 ${isDarkMode ? 'text-white/70 hover:bg-white/[0.05]' : 'text-gray-800 hover:bg-gray-50'} transition-colors`}
//                                                                     >
//                                                                         <Orbit className="w-4 h-4 opacity-70" /> {orbit}
//                                                                     </button>
//                                                                 ))}
//                                                                 <div className={`border-t ${isDarkMode ? 'border-white/[0.05]' : 'border-gray-200'} my-1`} />
//                                                                 <button
//                                                                     onClick={() => {
//                                                                         setIsOrbitDropdownOpen(false);
//                                                                     }}
//                                                                     className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 ${isDarkMode ? 'text-indigo-300 hover:bg-white/[0.05]' : 'text-indigo-500 hover:bg-gray-50'} transition-colors`}
//                                                                 >
//                                                                     <Plus className="w-4 h-4" /> Create New Orbit
//                                                                 </button>
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                     {/* Scope Filter */}
//                                                     <div className="relative flex-1">
//                                                         <button
//                                                             onClick={() => setIsScopeDropdownOpen(!isScopeDropdownOpen)}
//                                                             className={`w-full px-3 py-1.5 rounded-lg border flex items-center gap-2 text-xs ${isDarkMode ? 'bg-white/[0.03] border-white/[0.05] text-white/70' : 'bg-gray-50 border-gray-200 text-gray-800'} transition-colors`}
//                                                         >
//                                                             {filterScope === 'all' && <Globe className="w-4 h-4 opacity-70" />}
//                                                             {filterScope === 'url' && <LinkIcon className="w-4 h-4 opacity-70" />}
//                                                             {filterScope === 'global' && <Globe className="w-4 h-4 opacity-70" />}
//                                                             <span className="truncate">
//                                                                 {filterScope === 'all' ? 'All Notes' : filterScope === 'url' ? 'URL-Specific' : 'Global'}
//                                                             </span>
//                                                             <span className={`ml-auto transform transition-transform ${isScopeDropdownOpen ? 'rotate-180' : ''}`}>▾</span>
//                                                         </button>
//                                                         {isScopeDropdownOpen && (
//                                                             <div className={`absolute left-0 right-0 mt-1 py-1 rounded-lg border ${isDarkMode ? 'bg-[#030303] border-white/[0.05]' : 'bg-white border-gray-200'} shadow-lg z-50`}>
//                                                                 <button
//                                                                     onClick={() => {
//                                                                         setFilterScope('all');
//                                                                         setIsScopeDropdownOpen(false);
//                                                                     }}
//                                                                     className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 ${isDarkMode ? 'text-white/70 hover:bg-white/[0.05]' : 'text-gray-800 hover:bg-gray-50'} transition-colors`}
//                                                                 >
//                                                                     <Globe className="w-4 h-4 opacity-70" /> All Notes
//                                                                 </button>
//                                                                 <button
//                                                                     onClick={() => {
//                                                                         setFilterScope('url');
//                                                                         setIsScopeDropdownOpen(false);
//                                                                     }}
//                                                                     className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 ${isDarkMode ? 'text-white/70 hover:bg-white/[0.05]' : 'text-gray-800 hover:bg-gray-50'} transition-colors`}
//                                                                 >
//                                                                     <LinkIcon className="w-4 h-4 opacity-70" /> URL-Specific Notes
//                                                                 </button>
//                                                                 <button
//                                                                     onClick={() => {
//                                                                         setFilterScope('global');
//                                                                         setIsScopeDropdownOpen(false);
//                                                                     }}
//                                                                     className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 ${isDarkMode ? 'text-white/70 hover:bg-white/[0.05]' : 'text-gray-800 hover:bg-gray-50'} transition-colors`}
//                                                                 >
//                                                                     <Globe className="w-4 h-4 opacity-70" /> Global Notes
//                                                                 </button>
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                 </div>

//                                                 {/* Notes List */}
//                                                 {notes
//                                                     .filter(note => {
//                                                         if (filterOrbit === 'All Orbits') return true;
//                                                         if (filterOrbit === 'Only Ungrouped Notes') return note.orbit === 'Ungrouped';
//                                                         return note.orbit === filterOrbit;
//                                                     })
//                                                     .filter(note => {
//                                                         if (filterScope === 'all') return true;
//                                                         return note.scope === filterScope;
//                                                     })
//                                                     .map(note => (
//                                                         <div
//                                                             key={note.id}
//                                                             className={`p-4 rounded-lg border ${themeClasses} ${themeHoverClasses} transition-colors group`}
//                                                         >
//                                                             <div className="flex items-center gap-2 mb-2">
//                                                                 {/* Orbit pill */}
//                                                                 <div className="flex items-center gap-1">
//                                                                     <span
//                                                                         onClick={() => setSelectedOrbit(selectedOrbit === note.id ? null : note.id)}
//                                                                         className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium cursor-pointer transition-colors ${note.orbit === 'Ungrouped'
//                                                                             ? isDarkMode
//                                                                                 ? 'bg-white/[0.05] text-white/50 hover:bg-white/[0.1]'
//                                                                                 : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
//                                                                             : isDarkMode
//                                                                                 ? 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30'
//                                                                                 : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'}`}
//                                                                     >
//                                                                         <Orbit className="w-3 h-3" /> {note.orbit}
//                                                                     </span>
//                                                                 </div>
//                                                                 {/* Scope pill */}
//                                                                 <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${note.scope === 'global'
//                                                                     ? isDarkMode
//                                                                         ? 'bg-purple-500/20 text-purple-300'
//                                                                         : 'bg-purple-100 text-purple-600'
//                                                                     : isDarkMode
//                                                                         ? 'bg-blue-500/20 text-blue-300'
//                                                                         : 'bg-blue-100 text-blue-600'}`}>
//                                                                     {note.scope === 'global' ? <Globe className="w-3 h-3" /> : <LinkIcon className="w-3 h-3" />} {note.scope === 'global' ? 'Global' : 'URL-Specific'}
//                                                                 </span>
//                                                             </div>
//                                                             <p className={`text-sm ${isDarkMode ? 'text-white/70' : 'text-gray-800'} mb-2`}>{note.content}</p>
//                                                             <div className="flex items-center justify-between">
//                                                                 <div className="flex items-center gap-2">
//                                                                     {note.url && (
//                                                                         <a
//                                                                             href={note.url}
//                                                                             target="_blank"
//                                                                             rel="noopener noreferrer"
//                                                                             className={`flex items-center gap-1 text-xs ${isDarkMode ? 'text-white/30 hover:text-indigo-300' : 'text-gray-400 hover:text-indigo-500'} transition-colors`}
//                                                                         >
//                                                                             <LinkIcon className="w-3 h-3" />
//                                                                             <span>{note.url}</span>
//                                                                         </a>
//                                                                     )}
//                                                                     <button className={`p-1 rounded ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition-colors`}>
//                                                                         <Orbit className={`w-3 h-3 ${isDarkMode ? 'text-white/30 hover:text-indigo-300' : 'text-gray-400 hover:text-indigo-500'}`} />
//                                                                     </button>
//                                                                 </div>
//                                                                 <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                                                                     <button className={`p-1 rounded ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition-colors`}>
//                                                                         <Share2 className={`w-3 h-3 ${isDarkMode ? 'text-white/30 hover:text-indigo-300' : 'text-gray-400 hover:text-indigo-500'}`} />
//                                                                     </button>
//                                                                     <button className={`p-1 rounded ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition-colors`}>
//                                                                         <MoreVertical className={`w-3 h-3 ${isDarkMode ? 'text-white/30 hover:text-indigo-300' : 'text-gray-400 hover:text-indigo-500'}`} />
//                                                                     </button>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     ))}
//                                             </div>
//                                         ) : (
//                                             <div className="space-y-4">
//                                                 {/* Tasks List */}
//                                                 {tasks.map(task => (
//                                                     <div
//                                                         key={task.id}
//                                                         className={`flex items-center gap-3 p-4 rounded-lg border ${themeClasses} ${themeHoverClasses} transition-colors`}
//                                                     >
//                                                         <button
//                                                             onClick={() => toggleTask(task.id)}
//                                                             className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${task.completed
//                                                                 ? 'bg-indigo-500 border-indigo-500'
//                                                                 : isDarkMode ? 'border-white/20 hover:border-indigo-500' : 'border-gray-300 hover:border-indigo-500'
//                                                                 }`}
//                                                         >
//                                                             {task.completed && <Check className="w-3 h-3 text-white" />}
//                                                         </button>
//                                                         <span className={`text-sm flex-1 ${task.completed ? (isDarkMode ? 'text-white/30' : 'text-gray-400') : (isDarkMode ? 'text-white/70' : 'text-gray-800')} ${task.completed ? 'line-through' : ''}`}>
//                                                             {task.content}
//                                                         </span>
//                                                         <Clock className={`w-4 h-4 ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`} />
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         )}
//                                     </div>

//                                     {/* New Note/Task Input */}
//                                     <div className={`pt-6 mt-6 border-t ${isDarkMode ? 'border-white/[0.05]' : 'border-gray-200'}`}>
//                                         <div className="space-y-3">
//                                             {/* Quick Toggle Buttons */}
//                                             <div className="flex gap-2">
//                                                 {/* Note/Task Toggle */}
//                                                 <div className={`flex-1 flex rounded-lg overflow-hidden border ${isDarkMode ? 'border-white/[0.05]' : 'border-gray-200'}`}>
//                                                     <button
//                                                         onClick={() => setActiveTab('notes')}
//                                                         className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium transition-colors ${activeTab === 'notes'
//                                                             ? isDarkMode
//                                                                 ? 'bg-indigo-500 text-white'
//                                                                 : 'bg-indigo-500 text-white'
//                                                             : isDarkMode
//                                                                 ? 'bg-white/[0.03] text-white/50 hover:text-white'
//                                                                 : 'bg-gray-50 text-gray-500 hover:text-gray-900'
//                                                             }`}
//                                                     >
//                                                         <Circle className="w-3 h-3" />
//                                                         <span>Note</span>
//                                                     </button>
//                                                     <button
//                                                         onClick={() => setActiveTab('tasks')}
//                                                         className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium transition-colors ${activeTab === 'tasks'
//                                                             ? isDarkMode
//                                                                 ? 'bg-indigo-500 text-white'
//                                                                 : 'bg-indigo-500 text-white'
//                                                             : isDarkMode
//                                                                 ? 'bg-white/[0.03] text-white/50 hover:text-white'
//                                                                 : 'bg-gray-50 text-gray-500 hover:text-gray-900'
//                                                             }`}
//                                                     >
//                                                         <Check className="w-3 h-3" />
//                                                         <span>Task</span>
//                                                     </button>
//                                                 </div>

//                                                 {/* Global/Linked Toggle - Only show for notes */}
//                                                 {activeTab === 'notes' && (
//                                                     <div className={`flex-1 flex rounded-lg overflow-hidden border ${isDarkMode ? 'border-white/[0.05]' : 'border-gray-200'}`}>
//                                                         <button
//                                                             onClick={() => setCreationScope('global')}
//                                                             className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium transition-colors ${creationScope === 'global'
//                                                                 ? isDarkMode
//                                                                     ? 'bg-indigo-500 text-white'
//                                                                     : 'bg-indigo-500 text-white'
//                                                                 : isDarkMode
//                                                                     ? 'bg-white/[0.03] text-white/50 hover:text-white'
//                                                                     : 'bg-gray-50 text-gray-500 hover:text-gray-900'
//                                                                 }`}
//                                                         >
//                                                             <Globe className="w-3 h-3" />
//                                                             <span>Global</span>
//                                                         </button>
//                                                         <button
//                                                             onClick={() => setCreationScope('url')}
//                                                             className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium transition-colors ${creationScope === 'url'
//                                                                 ? isDarkMode
//                                                                     ? 'bg-indigo-500 text-white'
//                                                                     : 'bg-indigo-500 text-white'
//                                                                 : isDarkMode
//                                                                     ? 'bg-white/[0.03] text-white/50 hover:text-white'
//                                                                     : 'bg-gray-50 text-gray-500 hover:text-gray-900'
//                                                                 }`}
//                                                         >
//                                                             <LinkIcon className="w-3 h-3" />
//                                                             <span>Linked</span>
//                                                         </button>
//                                                     </div>
//                                                 )}
//                                             </div>

//                                             {/* Rich Text Input */}
//                                             <div className="flex gap-2">
//                                                 <div
//                                                     ref={contentEditableRef}
//                                                     contentEditable
//                                                     onInput={(e) => setNewNote(e.currentTarget.textContent || '')}
//                                                     onKeyDown={(e) => {
//                                                         if (e.key === 'Enter' && !e.shiftKey) {
//                                                             e.preventDefault();
//                                                             handleAddNote();
//                                                         }
//                                                     }}
//                                                     className={`flex-1 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-white/[0.03] border-white/[0.05] text-white/70 placeholder-white/30' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400'} border text-sm focus:outline-none focus:border-indigo-500/30 transition-colors min-h-[40px] max-h-[120px] overflow-y-auto relative ${!newNote ? 'before:content-[attr(data-placeholder)] before:absolute before:top-2 before:left-4 before:text-sm before:pointer-events-none' : ''}`}
//                                                     data-placeholder={activeTab === 'notes' ? "Capture a thought..." : "Add a new task..."}
//                                                     suppressContentEditableWarning
//                                                 />
//                                                 <button
//                                                     onClick={handleAddNote}
//                                                     className="p-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-400 transition-colors"
//                                                 >
//                                                     <Plus className="w-4 h-4" />
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Footer */}
//                                     <div className={`pt-6 mt-6 border-t ${isDarkMode ? 'border-white/[0.05]' : 'border-gray-200'}`}>
//                                         <div className={`flex items-center justify-between text-xs ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>
//                                             <div className="flex items-center gap-4">
//                                                 <button className={`hover:${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors`}>
//                                                     <HelpCircle className="w-4 h-4" />
//                                                 </button>
//                                                 <button className={`hover:${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors`}>
//                                                     <Settings className="w-4 h-4" />
//                                                 </button>
//                                                 <button
//                                                     onClick={toggleDarkMode}
//                                                     className={`hover:${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors`}
//                                                 >
//                                                     {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
//                                                 </button>
//                                             </div>
//                                             <div className="flex items-center gap-4">
//                                                 <button
//                                                     onClick={() => setCurrentView('memory-map')}
//                                                     className={`flex items-center gap-1 hover:${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors`}
//                                                 >
//                                                     <Orbit className="w-4 h-4" />
//                                                     <span>Memory Map</span>
//                                                 </button>
//                                                 <span>Alt + Space to toggle</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </>
//                             ) : null}
//                         </div>
//                     </motion.div>
//                 </>
//             )}
//         </AnimatePresence>
//     );
// }