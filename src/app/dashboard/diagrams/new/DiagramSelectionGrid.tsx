import React, { useState } from 'react';
import {
  Brush,
  ChevronDownIcon,
  NotebookPenIcon,
  Share2,
  Activity,
  Box,
  GitBranch,
  Layers,
  PieChart,
  Grid,
  FileText,
  Network,
  Map,
  Code,
  BarChart2,
  LayoutGrid,
  Package,
  Trello,
  Home,
  Compass,
  TimerIcon,
} from 'lucide-react';
import { MicrophoneIcon } from '@heroicons/react/20/solid';
import { OptionType } from '@/lib/utils';
import { Menu } from '@headlessui/react';
import { HexColorPicker } from 'react-colorful';

// Category definitions
const DIAGRAM_CATEGORIES = {
  FLOW: 'Flow & Process',
  DATA: 'Data Visualization',
  SOFTWARE: 'Software & Architecture',
  PLANNING: 'Planning & Tracking',
};

type OptionsList = {
  type: OptionType;
  icon: React.ReactNode;
  description: string;
  badgeText?: string;
  badgeColor?: string;
}[];

const DiagramSelectionGrid = ({
  setSelectedOption,
  setVisionDescription,
  setColorPalette,
  setComplexityLevel,
}: {
  setSelectedOption: (option: OptionType) => void;
  setVisionDescription: (description: string) => void;
  setColorPalette: (palette: string) => void;
  setComplexityLevel: (level: string) => void;
}) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    keyof typeof DIAGRAM_CATEGORIES | null
  >(null);
  const [selectedOptionState, setSelectedOptionState] = useState<OptionType>(null);
  const [showColorPicker, setShowColorPicker] = useState(true);
  const [customColor, setCustomColor] = useState('#3b82f6');

  // Color palette options
  const colorPaletteOptions = [
    'Brand colors (default)',
    'Monochromatic',
    'Complementary',
    'Analogous',
    'Custom...',
  ];

  // Complexity options
  const complexityOptions = ['Medium (default)', 'Simple', 'Detailed', 'Complex'];

  const [selectedColorPalette, setSelectedColorPalette] = useState(
    colorPaletteOptions[0]
  );
  const [selectedComplexity, setSelectedComplexity] = useState(
    complexityOptions[0]
  );

  // Diagram options organized by category
  const diagramOptions: {
    [key in keyof typeof DIAGRAM_CATEGORIES]: OptionsList;
  } = {
    FLOW: [
      {
        type: 'Flowchart',
        icon: <Share2 className="h-12 w-12 text-indigo-500" strokeWidth={1.5} />,
        description: 'Visualize process flows and decision paths',
      },
      {
        type: 'Sequence Diagram',
        icon: <Activity className="h-12 w-12 text-blue-500" strokeWidth={1.5} />,
        description: 'Show interactions between components over time',
      },
      {
        type: 'State Diagram',
        icon: <Box className="h-12 w-12 text-violet-500" strokeWidth={1.5} />,
        description: 'Represent states and transitions of a system',
      },
      {
        type: 'User Journey',
        icon: <Map className="h-12 w-12 text-emerald-500" strokeWidth={1.5} />,
        description: 'Map out user experiences step by step',
      },
      {
        type: 'Block Diagram',
        icon: <Layers className="h-12 w-12 text-amber-500" strokeWidth={1.5} />,
        description: 'Show components and their connections',
      },
    ],
    DATA: [
      {
        type: 'Pie Chart',
        icon: <PieChart className="h-12 w-12 text-pink-500" strokeWidth={1.5} />,
        description: 'Display proportional data in circular segments',
      },
      {
        type: 'Quadrant Chart',
        icon: <Grid className="h-12 w-12 text-cyan-500" strokeWidth={1.5} />,
        description: 'Plot items across four categorized sections',
      },
      {
        type: 'Sankey',
        icon: <Share2 className="h-12 w-12 text-orange-500" strokeWidth={1.5} />,
        description: 'Visualize flow quantities with width-variable arrows',
      },
      {
        type: 'XY Chart',
        icon: <BarChart2 className="h-12 w-12 text-red-500" strokeWidth={1.5} />,
        description: 'Plot data points on two-dimensional grid',
      },
      {
        type: 'Radar',
        icon: <Compass className="h-12 w-12 text-teal-500" strokeWidth={1.5} />,
        description: 'Compare multiple variables across axes',
      },
    ],
    SOFTWARE: [
      {
        type: 'Class Diagram',
        icon: <FileText className="h-12 w-12 text-violet-500" strokeWidth={1.5} />,
        description: 'Model object-oriented system structure',
      },
      {
        type: 'Entity Relationship Diagram',
        icon: <Network className="h-12 w-12 text-emerald-500" strokeWidth={1.5} />,
        description: 'Map relationships between data entities',
      },
      {
        type: 'Requirement Diagram',
        icon: <FileText className="h-12 w-12 text-sky-500" strokeWidth={1.5} />,
        description: 'Document system requirements and dependencies',
      },
      {
        type: 'Gitgraph Diagram',
        icon: <GitBranch className="h-12 w-12 text-gray-700" strokeWidth={1.5} />,
        description: 'Visualize Git branch and merge operations',
      },
      {
        type: 'C4 Diagram',
        icon: <Layers className="h-12 w-12 text-purple-600" strokeWidth={1.5} />,
        description: 'Model software architecture at different levels',
      },
      {
        type: 'Packet',
        icon: <Package className="h-12 w-12 text-blue-600" strokeWidth={1.5} />,
        description: 'Visualize network packet structures and flows',
      },
      {
        type: 'Architecture',
        icon: <Home className="h-12 w-12 text-amber-600" strokeWidth={1.5} />,
        description: 'Document system architecture and components',
      },
      {
        type: 'ZenUML',
        icon: <Code className="h-12 w-12 text-indigo-600" strokeWidth={1.5} />,
        description: 'Text-based UML sequence diagrams',
      },
    ],
    PLANNING: [
      {
        type: 'Gantt',
        icon: <TimerIcon className="h-12 w-12 text-green-500" strokeWidth={1.5} />,
        description: 'Schedule project tasks and timelines',
      },
      {
        type: 'Mindmaps',
        icon: <Network className="h-12 w-12 text-amber-500" strokeWidth={1.5} />,
        description: 'Organize ideas in a hierarchical structure',
      },
      {
        type: 'Timeline',
        icon: <TimerIcon className="h-12 w-12 text-blue-500" strokeWidth={1.5} />,
        description: 'Visualize events in chronological order',
      },
      {
        type: 'Kanban',
        icon: <Trello className="h-12 w-12 text-cyan-600" strokeWidth={1.5} />,
        description: 'Track work progress across different stages',
      },
    ],
  };

  const originalOptions: OptionsList = [
    {
      type: 'Illustration',
      icon: <Brush className="h-12 w-12 text-red-500" strokeWidth={1.5} />,
      description: 'Vector graphics ideal for storytelling and decoration',
      badgeText: 'New',
      badgeColor: 'bg-red-100 text-red-800',
    },
    {
      type: 'Infographic',
      icon: <NotebookPenIcon className="h-12 w-12 text-blue-500" strokeWidth={1.5} />,
      description: 'Represent complex information visually',
      badgeText: 'New',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
  ];

  // Create a complete array of all options
  const allDiagramOptions = [
    ...originalOptions,
    ...Object.values(diagramOptions)
      .flat()
      .sort((a, b) => (a.type as string).localeCompare(b.type as string)),
  ];

  // Handler for selecting a diagram option
  const handleOptionSelect = (option: OptionType) => {
    setSelectedOptionState(option);
    setSelectedOption(option);
  };

  // Handler for color palette change
  const handleColorPaletteChange = (palette: string) => {
    // if (palette === 'Custom...') {
    //   setShowColorPicker(true);
    // } else {
      setSelectedColorPalette(palette);
      setColorPalette(palette);
      // setShowColorPicker(false);
    // }
  };

  // Handler for applying custom color
  const handleCustomColorApply = () => {
    const customPalette = `Custom (${customColor})`;
    setSelectedColorPalette(customPalette);
    setColorPalette(customPalette);
    setShowColorPicker(false);
  };

  // Handler for complexity change
  const handleComplexityChange = (level: string) => {
    setSelectedComplexity(level);
    setComplexityLevel(level);
  };

  return (
    <div className="rounded-xl bg-white px-6 py-8 shadow-sm">
      {/* Categories Tabs */}
      <div className="mb-6 border-b border-slate-200">
        <div className="no-scrollbar flex overflow-x-auto">
          <button
            className={`whitespace-nowrap px-4 pb-2 text-base font-medium transition-all ${
              !selectedCategory
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            All Types
          </button>

          {Object.entries(DIAGRAM_CATEGORIES).map(([key, category]) => (
            <button
              key={key}
              className={`whitespace-nowrap px-4 pb-2 text-base font-medium transition-all ${
                selectedCategory === key
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              onClick={() => setSelectedCategory(key as keyof typeof DIAGRAM_CATEGORIES)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Diagram Selection Grid */}
      <div className="mb-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(selectedCategory !== null
            ? diagramOptions[selectedCategory]
            : allDiagramOptions
          ).map(({ type, icon, description, badgeColor, badgeText }) => (
            <div
              key={type}
              className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 hover:shadow-md ${
                hoveredCard === type || selectedOptionState === type
                  ? 'border-indigo-500 shadow-sm'
                  : 'border-slate-200'
              } ${selectedOptionState === type ? 'bg-indigo-50' : 'bg-white'}`}
              onMouseEnter={() => setHoveredCard(type)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleOptionSelect(type)}
            >
              {badgeText && (
                <div className="mb-1 flex justify-end">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${badgeColor || 'bg-gray-100 text-gray-800'}`}
                  >
                    {badgeText}
                  </span>
                </div>
              )}

              <div className="mb-3 flex h-20 items-center justify-center">
                {icon}
              </div>
              <h4 className="mb-1 text-center font-medium text-slate-800">
                {type}
              </h4>
              <p className="text-center text-xs text-slate-500">{description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Vision Description */}
      <div className="mb-8" id="vision-description">
        <h3 className="mb-3 text-lg font-medium text-slate-800">
          Describe your vision
        </h3>
        <div className="relative overflow-hidden rounded-lg border border-slate-200 shadow-sm">
          <textarea
            className="min-h-36 w-full border-0 p-4 pr-20 text-base focus:ring-1 focus:ring-indigo-500"
            placeholder="Describe what you want to visualize... The more details you provide, the better!"
            rows={4}
            onChange={(e) => setVisionDescription(e.target.value)}
          ></textarea>
        </div>
      </div>

      {/* Advanced Options */}
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <h3 className="text-lg font-medium text-slate-800">Advanced options</h3>
            <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              Optional
            </span>
          </div>
          <button className="text-sm text-indigo-600 hover:text-indigo-800">
            Show more
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Color Palette Dropdown */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Color palette
            </label>
            <Menu as="div" className="relative w-full">
              <Menu.Button className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white p-2.5 text-left text-slate-700 hover:bg-slate-50">
                <span>{selectedColorPalette}</span>
                <ChevronDownIcon
                  className="h-5 w-5 transform text-slate-500 transition-transform"
                  aria-hidden="true"
                />
              </Menu.Button>

              <Menu.Items className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                {colorPaletteOptions.map((option) => (
                  <Menu.Item key={option}>
                    {({ active }) => (
                      <div
                        className={`cursor-pointer px-3 py-2 ${
                          active ? 'bg-indigo-50' : ''
                        } ${
                          selectedColorPalette.startsWith(option)
                            ? 'bg-indigo-50 font-medium text-indigo-600'
                            : 'text-slate-700'
                        }`}
                        onClick={() => handleColorPaletteChange(option)}
                      >
                        {option}
                      </div>
                    )}
                  </Menu.Item>
                ))}
                
                {showColorPicker && (
                  <div className="p-3 border-t border-slate-200">
                    <HexColorPicker 
                      color={customColor} 
                      onChange={setCustomColor} 
                      className="w-full mb-3"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-6 h-6 rounded-full border border-slate-300 mr-2"
                          style={{ backgroundColor: customColor }}
                        />
                        <span className="text-sm font-mono">{customColor}</span>
                      </div>
                      <button
                        onClick={handleCustomColorApply}
                        className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </Menu.Items>
            </Menu>
          </div>

          {/* Complexity Level Dropdown */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Complexity level
            </label>
            <Menu as="div" className="relative w-full">
              <Menu.Button className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white p-2.5 text-left text-slate-700 hover:bg-slate-50">
                <span>{selectedComplexity}</span>
                <ChevronDownIcon
                  className="h-5 w-5 transform text-slate-500 transition-transform"
                  aria-hidden="true"
                />
              </Menu.Button>

              <Menu.Items className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                {complexityOptions.map((option) => (
                  <Menu.Item key={option}>
                    {({ active }) => (
                      <div
                        className={`cursor-pointer px-3 py-2 ${
                          active ? 'bg-indigo-50' : ''
                        } ${
                          selectedComplexity === option
                            ? 'bg-indigo-50 font-medium text-indigo-600'
                            : 'text-slate-700'
                        }`}
                        onClick={() => handleComplexityChange(option)}
                      >
                        {option}
                      </div>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagramSelectionGrid;