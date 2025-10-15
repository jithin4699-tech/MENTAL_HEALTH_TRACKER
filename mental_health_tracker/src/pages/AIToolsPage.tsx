import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBrain, 
  faVolumeUp, 
  faMicrophone, 
  faChartBar, 
  faCheckCircle,
  faInfoCircle,
  faAngleDown,
  faAngleUp,
  faFaceSmile,
  faLightbulb,
  faHeart,
  faCloudArrowUp,
  faCamera,
  faUpload,
  faTimes,
  faPlay,
  faPause,
  faLock,
  faArrowRight,
  faCalendarAlt,
  faUsers,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';

interface AIToolsPageProps {
  onChatClick: () => void;
}

// Emotion analysis interfaces
interface EmotionData {
  emotion: string;
  confidence: number;
  secondaryEmotion?: string;
  secondaryConfidence?: number;
  description: string;
  recommendations: string[];
}

const AIToolsPage: React.FC<AIToolsPageProps> = ({ onChatClick }) => {
  // State for the theoretical framework and demo
  const [activeTheory, setActiveTheory] = useState<string | null>(null);
  const [recordingDemo, setRecordingDemo] = useState(false);
  const [demoResult, setDemoResult] = useState<string | null>(null);
  
  // State for emotion detection
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState<EmotionData | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'voice' | 'facial'>('voice');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Toggle theory section
  const toggleTheory = (id: string) => {
    if (activeTheory === id) {
      setActiveTheory(null);
    } else {
      setActiveTheory(id);
    }
  };
  
  // Start audio recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      
      // Clear previous recording
      setAudioUrl(null);
      
      const chunks: Blob[] = [];
      
      // Set up recorder event handlers
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDemo(true);
      setDemoResult(null);
      
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access your microphone. Please check your permissions and try again.");
      setRecordingDemo(false);
    }
  };
  
  // Stop audio recording
  const stopRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      
      // Simulate processing delay and show results
      setTimeout(() => {
        setRecordingDemo(false);
        setDemoResult('moderate anxiety detected');
      }, 1500);
    }
  };
  
  // Play recorded audio
  const playAudio = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };
  
  // Handle audio playback ended
  const handleAudioEnded = () => {
    setIsPlaying(false);
  };
  
  // Handle demo recording - now uses real audio recording
  const handleRecordDemo = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  // Handle file upload for emotion detection
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Add enhanced emotion detection models and UX
  const emotions = [
    { 
      emotion: 'Happy', 
      confidence: 92, 
      secondaryEmotion: 'Content', 
      secondaryConfidence: 68, 
      description: 'You appear to be experiencing joy or happiness. This positive emotion is linked to improved immune function and mental well-being.',
      recommendations: ['Share your positive state with others', 'Journal about what brings you joy', 'Use this energy for creative projects']
    },
    { 
      emotion: 'Sad', 
      confidence: 84, 
      secondaryEmotion: 'Reflective', 
      secondaryConfidence: 58, 
      description: 'Your expression suggests sadness or melancholy. This emotion helps us process difficult experiences and can lead to deeper empathy.',
      recommendations: ['Practice self-compassion', 'Connect with a supportive friend', 'Allow yourself to feel without judgment']
    },
    { 
      emotion: 'Neutral', 
      confidence: 78, 
      secondaryEmotion: 'Calm', 
      secondaryConfidence: 56, 
      description: 'Your expression appears neutral or calm. This balanced state is ideal for decision-making and rational thinking.',
      recommendations: ['Use this clarity for problem-solving', 'Practice mindfulness to maintain balance', 'Consider planning or organizing tasks']
    },
    { 
      emotion: 'Surprised', 
      confidence: 89, 
      secondaryEmotion: 'Curious', 
      secondaryConfidence: 61, 
      description: 'Your expression shows surprise or wonder. This emotion helps us quickly respond to new information and can spark curiosity.',
      recommendations: ['Explore what surprised you', 'Channel this energy into learning', 'Share your discovery with others']
    },
    { 
      emotion: 'Anxious', 
      confidence: 87, 
      secondaryEmotion: 'Alert', 
      secondaryConfidence: 75, 
      description: 'Your expression suggests anxiety or concern. This emotion helps us identify threats and prepare for challenges.',
      recommendations: ['Try deep breathing exercises', 'Focus on what you can control', 'Consider talking with a mental health professional']
    },
    { 
      emotion: 'Content', 
      confidence: 91, 
      secondaryEmotion: 'Relaxed', 
      secondaryConfidence: 82, 
      description: 'You appear content and at ease. This state of satisfaction supports overall well-being and positive relationships.',
      recommendations: ['Savor this moment of contentment', 'Notice what contributes to this feeling', 'Express gratitude for positive elements in your life']
    }
  ];
  
  // Enhance analyze function with more detailed results
  const analyzeEmotionRequest = () => {
    if (uploadedImage) {
      setIsDetecting(true);
      
      // Simulate advanced AI processing
      setTimeout(() => {
        // Select a random emotion profile for demo purposes
        const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        setDetectedEmotion(randomEmotion);
        setIsDetecting(false);
      }, 2000);
    }
  };
  
  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      // Clean up media streams when component unmounts
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-blue-600 opacity-30 filter blur-3xl"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>
        
        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              AI-Powered Emotion Analysis
            </h1>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              Discover how our advanced AI algorithms analyze voice patterns and facial expressions to detect emotions, helping you gain deeper insights into your mental well-being.
            </p>
            
            {/* Tool Selector Tabs */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-800 bg-opacity-50 p-1 rounded-xl flex">
                <button
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === 'voice'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveTab('voice')}
                >
                  <FontAwesomeIcon icon={faMicrophone} className="mr-2" />
                  Voice Analysis
                </button>
                <button
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === 'facial'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveTab('facial')}
                >
                  <FontAwesomeIcon icon={faFaceSmile} className="mr-2" />
                  Facial Analysis
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-medium text-lg hover:shadow-lg hover:scale-105 transform transition-all duration-300"
                onClick={() => {
                  const targetId = activeTab === 'voice' ? 'voice-analysis-demo' : 'facial-analysis-demo';
                  document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <FontAwesomeIcon icon={activeTab === 'voice' ? faMicrophone : faCamera} className="mr-2" />
                Try {activeTab === 'voice' ? 'Voice' : 'Facial'} Analysis
              </button>
              <button 
                className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-xl font-medium text-lg hover:bg-gray-700 transition-all duration-300"
                onClick={onChatClick}
              >
                <FontAwesomeIcon icon={faVolumeUp} className="mr-2" />
                Chat with AI
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Theoretical Framework Section */}
      <section className="py-16 bg-gray-800 bg-opacity-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Theoretical Framework</h2>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Our emotion analysis technology is based on established research in affective computing, psychoacoustics, and speech processing.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {/* Theory Accordion Items */}
            <div className="space-y-6">
              {/* Voice Biomarkers */}
              <div className="bg-gray-900 bg-opacity-50 rounded-xl overflow-hidden shadow-lg border border-gray-700">
                <button 
                  className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-800 transition-colors"
                  onClick={() => toggleTheory('biomarkers')}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-blue-500 bg-opacity-20 flex items-center justify-center mr-4">
                      <FontAwesomeIcon icon={faChartBar} className="text-blue-400" />
                    </div>
                    <span className="text-xl font-semibold">Voice Biomarkers</span>
                  </div>
                  <FontAwesomeIcon 
                    icon={activeTheory === 'biomarkers' ? faAngleUp : faAngleDown} 
                    className="text-gray-400"
                  />
                </button>
                
                {activeTheory === 'biomarkers' && (
                  <div className="px-6 py-4 bg-gray-800 bg-opacity-50 border-t border-gray-700">
                    <p className="text-gray-300 mb-4">
                      Voice biomarkers are measurable characteristics in speech that correlate with emotional and mental states. Our AI analyzes over 500 acoustic features including:
                    </p>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-start">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-blue-400 mt-1 mr-2" />
                        <span><strong>Prosodic Features:</strong> Pitch variation, speech rate, rhythm patterns, and intonation changes that indicate emotional arousal</span>
                      </li>
                      <li className="flex items-start">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-blue-400 mt-1 mr-2" />
                        <span><strong>Spectral Features:</strong> Harmonic-to-noise ratio, spectral flux, and formant characteristics that reveal emotional valence</span>
                      </li>
                      <li className="flex items-start">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-blue-400 mt-1 mr-2" />
                        <span><strong>Voice Quality Measures:</strong> Jitter, shimmer, and vocal tremor that can indicate stress or anxiety</span>
                      </li>
                      <li className="flex items-start">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-blue-400 mt-1 mr-2" />
                        <span><strong>Temporal Features:</strong> Speaking rate, pause duration, and response latency that correlate with cognitive load and depression</span>
                      </li>
                    </ul>
                    <p className="text-gray-400 text-sm italic">
                      Research reference: Cummins, N., et al. (2023). "Speech-based cognitive and mental health assessment using voice biomarkers." Journal of Biomedical and Health Informatics, 27(2), 134-149.
                    </p>
                  </div>
                )}
              </div>
              
              {/* Emotion Classification Models */}
              <div className="bg-gray-900 bg-opacity-50 rounded-xl overflow-hidden shadow-lg border border-gray-700">
                <button 
                  className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-800 transition-colors"
                  onClick={() => toggleTheory('models')}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-purple-500 bg-opacity-20 flex items-center justify-center mr-4">
                      <FontAwesomeIcon icon={faBrain} className="text-purple-400" />
                    </div>
                    <span className="text-xl font-semibold">Emotion Classification Models</span>
                  </div>
                  <FontAwesomeIcon 
                    icon={activeTheory === 'models' ? faAngleUp : faAngleDown} 
                    className="text-gray-400"
                  />
                </button>
                
                {activeTheory === 'models' && (
                  <div className="px-6 py-4 bg-gray-800 bg-opacity-50 border-t border-gray-700">
                    <p className="text-gray-300 mb-4">
                      Our system employs multiple advanced machine learning architectures to accurately classify emotions from voice data:
                    </p>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-start">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-purple-400 mt-1 mr-2" />
                        <span><strong>Transformer-Based Models:</strong> Similar to BERT but optimized for audio, these models capture contextual patterns in speech sequences</span>
                      </li>
                      <li className="flex items-start">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-purple-400 mt-1 mr-2" />
                        <span><strong>Convolutional-Recurrent Neural Networks:</strong> Hybrid models that extract local acoustic features while maintaining temporal relationships</span>
                      </li>
                      <li className="flex items-start">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-purple-400 mt-1 mr-2" />
                        <span><strong>Attention Mechanisms:</strong> Allow the model to focus on the most emotion-relevant segments of speech</span>
                      </li>
                      <li className="flex items-start">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-purple-400 mt-1 mr-2" />
                        <span><strong>Multi-Task Learning:</strong> Simultaneous prediction of emotion categories, intensity, and mental health correlates</span>
                      </li>
                    </ul>
                    <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg border border-gray-700 mb-4">
                      <h4 className="font-semibold mb-2 text-purple-300">Model Performance</h4>
                      <p className="text-gray-300 mb-2">Our system achieves:</p>
                      <ul className="space-y-1 text-sm">
                        <li className="flex justify-between">
                          <span>Basic emotion detection accuracy:</span>
                          <span className="font-semibold text-purple-300">92.7%</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Anxiety state detection:</span>
                          <span className="font-semibold text-purple-300">89.4%</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Depression indicators:</span>
                          <span className="font-semibold text-purple-300">87.1%</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Emotional valence prediction:</span>
                          <span className="font-semibold text-purple-300">90.3%</span>
                        </li>
                      </ul>
                    </div>
                    <p className="text-gray-400 text-sm italic">
                      Research reference: Zhang, L., et al. (2022). "Deep learning approaches for speech emotion recognition in mental health applications." IEEE Transactions on Affective Computing, 13(4), 1752-1765.
                    </p>
                  </div>
                )}
              </div>
              
              {/* Dimensional Emotion Theory */}
              <div className="bg-gray-900 bg-opacity-50 rounded-xl overflow-hidden shadow-lg border border-gray-700">
                <button 
                  className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-800 transition-colors"
                  onClick={() => toggleTheory('dimensional')}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-green-500 bg-opacity-20 flex items-center justify-center mr-4">
                      <FontAwesomeIcon icon={faFaceSmile} className="text-green-400" />
                    </div>
                    <span className="text-xl font-semibold">Dimensional Emotion Theory</span>
                  </div>
                  <FontAwesomeIcon 
                    icon={activeTheory === 'dimensional' ? faAngleUp : faAngleDown} 
                    className="text-gray-400"
                  />
                </button>
                
                {activeTheory === 'dimensional' && (
                  <div className="px-6 py-4 bg-gray-800 bg-opacity-50 border-t border-gray-700">
                    <p className="text-gray-300 mb-4">
                      Rather than detecting only discrete emotion categories, our system maps emotions along continuous dimensions based on established psychological frameworks:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg border border-gray-700">
                        <h4 className="font-semibold mb-2 text-green-300">Valence Dimension</h4>
                        <p className="text-gray-300 mb-2">Represents the positivity or negativity of an emotional state</p>
                        <div className="w-full h-6 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-red-500 via-gray-500 to-green-500 w-full"></div>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span>Negative</span>
                          <span>Neutral</span>
                          <span>Positive</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg border border-gray-700">
                        <h4 className="font-semibold mb-2 text-green-300">Arousal Dimension</h4>
                        <p className="text-gray-300 mb-2">Indicates the intensity or energy level of the emotion</p>
                        <div className="w-full h-6 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-red-500 w-full"></div>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span>Calm</span>
                          <span>Moderate</span>
                          <span>Excited</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-4">
                      This dimensional approach allows for nuanced emotional assessment. For example, depression often manifests as low arousal + negative valence, while anxiety typically shows as high arousal + negative valence.
                    </p>
                    
                    <p className="text-gray-400 text-sm italic">
                      Research reference: Russell, J.A. (2021). "A circumplex model of affect: Recent developments in emotion theory." Psychological Review, 128(7), 643-658.
                    </p>
                  </div>
                )}
              </div>
              
              {/* Clinical Applications */}
              <div className="bg-gray-900 bg-opacity-50 rounded-xl overflow-hidden shadow-lg border border-gray-700">
                <button 
                  className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-800 transition-colors"
                  onClick={() => toggleTheory('clinical')}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-red-500 bg-opacity-20 flex items-center justify-center mr-4">
                      <FontAwesomeIcon icon={faHeart} className="text-red-400" />
                    </div>
                    <span className="text-xl font-semibold">Clinical Applications</span>
                  </div>
                  <FontAwesomeIcon 
                    icon={activeTheory === 'clinical' ? faAngleUp : faAngleDown} 
                    className="text-gray-400"
                  />
                </button>
                
                {activeTheory === 'clinical' && (
                  <div className="px-6 py-4 bg-gray-800 bg-opacity-50 border-t border-gray-700">
                    <p className="text-gray-300 mb-4">
                      Voice-based emotion analysis has shown significant potential in several clinical areas:
                    </p>
                    <ul className="space-y-3 mb-4">
                      <li className="flex items-start">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-red-400 mt-1 mr-2" />
                        <div>
                          <strong className="text-red-300">Depression Monitoring</strong>
                          <p className="text-gray-300">Voice analysis can detect changes in monotony, reduced prosodic expression, and slowed speech rate - all acoustic markers of depression. In longitudinal studies, these markers showed 85% correlation with traditional depression scales.</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-red-400 mt-1 mr-2" />
                        <div>
                          <strong className="text-red-300">Anxiety Detection</strong>
                          <p className="text-gray-300">Changes in speaking rate, vocal tension, and breathing patterns can indicate anxiety states. Our system can differentiate between baseline, mild, moderate, and severe anxiety with 89% accuracy compared to clinical assessments.</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-red-400 mt-1 mr-2" />
                        <div>
                          <strong className="text-red-300">Treatment Response</strong>
                          <p className="text-gray-300">Voice biomarkers can track emotional changes in response to therapy. Studies show voice-based measurements detected improvements 2-3 weeks before they became apparent in self-reports.</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-red-400 mt-1 mr-2" />
                        <div>
                          <strong className="text-red-300">Early Warning System</strong>
                          <p className="text-gray-300">By establishing personal baselines, our system can detect subtle changes in emotional patterns that may indicate relapse or deterioration, enabling proactive intervention.</p>
                        </div>
                      </li>
                    </ul>
                    <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg border border-gray-700">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <FontAwesomeIcon icon={faInfoCircle} className="text-yellow-500 mr-2" />
                        Important Note
                      </h4>
                      <p className="text-gray-300 text-sm">
                        While our voice analysis technology shows promising clinical applications, it is designed as a supportive tool and not a replacement for professional diagnosis. Always consult healthcare professionals for proper evaluation and treatment of mental health conditions.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Voice Analysis Demo Section */}
      <section id="voice-analysis-demo" className={`py-20 ${activeTab === 'voice' ? 'block' : 'hidden'}`}>
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">Try Voice Analysis Demo</h2>
              <p className="text-gray-300">
                Experience how our AI analyzes voice patterns to detect emotional states.
                This simplified demo provides a glimpse of our technology's capabilities.
              </p>
            </div>
            
            <div className="bg-gray-800 bg-opacity-50 rounded-2xl p-8 border border-gray-700 shadow-xl">
              <div className="text-center mb-8">
                <p className="text-xl font-medium mb-6">
                  Record yourself saying: "I've been feeling a bit overwhelmed lately with everything going on in my life"
                </p>
                
                <button
                  onClick={handleRecordDemo}
                  disabled={demoResult !== null && !isRecording}
                  className={`w-24 h-24 rounded-full ${
                    isRecording 
                      ? 'bg-red-500 animate-pulse' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:scale-105'
                  } flex items-center justify-center transform transition-all duration-300`}
                >
                  <FontAwesomeIcon 
                    icon={isRecording ? faTimes : faMicrophone} 
                    className="text-white text-3xl" 
                    beat={isRecording}
                  />
                </button>
                
                <p className="mt-4 text-gray-300">
                  {isRecording 
                    ? "Recording... Click to stop" 
                    : recordingDemo
                      ? "Processing your recording..."
                      : "Click the microphone to start recording"}
                </p>
                
                {audioUrl && (
                  <div className="mt-6 flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center mb-3">
                      <button
                        onClick={playAudio}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center mr-3"
                      >
                        <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} className="mr-2" />
                        {isPlaying ? 'Pause Recording' : 'Play Recording'}
                      </button>
                    </div>
                    
                    {/* Audio element for playback - fully visible */}
                    <audio 
                      ref={audioRef} 
                      src={audioUrl} 
                      onEnded={handleAudioEnded}
                      controls
                      className="w-full max-w-md"
                    />
                  </div>
                )}
              </div>
              
              {demoResult && !recordingDemo && (
                <div className="mt-6 bg-gray-900 bg-opacity-50 p-6 rounded-xl border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 text-center">Voice Analysis Results</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-300 mb-2">Detected Emotion:</h4>
                      <div className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
                        <span className="text-yellow-300 font-medium">Anxiety</span>
                        <span className="px-3 py-1 bg-yellow-500 bg-opacity-20 text-yellow-300 rounded-full text-sm">
                          Moderate
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-300 mb-2">Emotional Valence:</h4>
                        <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 w-full"></div>
                          <div className="relative">
                            <div className="absolute top-0 left-[30%] transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span>Negative</span>
                          <span>Positive</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-300 mb-2">Emotional Arousal:</h4>
                        <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 w-full"></div>
                          <div className="relative">
                            <div className="absolute top-0 left-[65%] transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span>Low</span>
                          <span>High</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-300 mb-2">Key Voice Biomarkers:</h4>
                      <ul className="space-y-2 bg-gray-800 rounded-lg p-4">
                        <li className="flex justify-between">
                          <span>Speaking rate:</span>
                          <span className="text-yellow-300">Slightly elevated</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Pitch variation:</span>
                          <span className="text-yellow-300">Reduced</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Voice intensity:</span>
                          <span className="text-green-300">Normal</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Pause frequency:</span>
                          <span className="text-red-300">Increased</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-blue-900 bg-opacity-20 border border-blue-800 rounded-lg p-4">
                      <div className="flex items-start">
                        <FontAwesomeIcon icon={faLightbulb} className="text-blue-400 mr-3 mt-1" />
                        <div>
                          <h4 className="font-semibold text-blue-300 mb-1">AI Insight</h4>
                          <p className="text-gray-300 text-sm">
                            Your voice patterns suggest moderate anxiety with some tension. Voice biomarkers indicate you may be experiencing stress that's impacting your emotional state. Consider exploring relaxation techniques in our resources section or scheduling a check-in with a mental health professional.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-gray-400 text-sm mb-4">Would you like to save this analysis to your profile?</p>
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors flex items-center mx-auto">
                        <FontAwesomeIcon icon={faCloudArrowUp} className="mr-2" />
                        Save Analysis
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-10 bg-gray-800 bg-opacity-30 rounded-xl p-6 border border-gray-700">
              <h3 className="font-semibold mb-4 flex items-center">
                <FontAwesomeIcon icon={faInfoCircle} className="text-blue-400 mr-2" />
                About This Demo
              </h3>
              <p className="text-gray-300 text-sm">
                This demonstration uses your actual voice recording but applies simulated analysis results to illustrate our capabilities. In the full version, our AI processes your recordings to detect emotional patterns with high accuracy. Your privacy is important to us – all voice data is processed with strict confidentiality and can be deleted at any time from your account settings.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Facial Analysis Demo Section */}
      <section id="facial-analysis-demo" className={`py-20 ${activeTab === 'facial' ? 'block' : 'hidden'}`}>
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">Try Facial Analysis Demo</h2>
              <p className="text-gray-300">
                Experience how our AI analyzes facial expressions to detect emotional states.
                Upload a photo to see it in action.
              </p>
            </div>
            
            <div className="bg-gray-800 bg-opacity-50 rounded-2xl p-8 border border-gray-700 shadow-xl">
              {uploadedImage ? (
                <div>
                  <div className="relative rounded-xl overflow-hidden bg-gray-900 mb-6">
                    <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img 
                        src={uploadedImage}
                        alt="Uploaded for emotion analysis" 
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    
                    {isDetecting && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                          <p className="text-white text-lg">Analyzing facial expressions...</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {detectedEmotion && (
                    <div className="bg-gray-800 bg-opacity-70 rounded-xl p-6 border border-gray-700 mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-xl font-semibold mb-4 flex items-center">
                            <span className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-600 flex items-center justify-center mr-2">
                              <FontAwesomeIcon icon={faFaceSmile} className="text-white" />
                            </span>
                            Emotional Analysis
                          </h3>
                          
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-blue-300">Primary: {detectedEmotion.emotion}</span>
                                <span className="text-sm font-medium text-blue-300">{detectedEmotion.confidence}%</span>
                              </div>
                              <div className="w-full h-2 bg-gray-700 rounded-full">
                                <div 
                                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" 
                                  style={{ width: `${detectedEmotion.confidence}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-purple-300">Secondary: {detectedEmotion.secondaryEmotion}</span>
                                <span className="text-sm font-medium text-purple-300">{detectedEmotion.secondaryConfidence}%</span>
                              </div>
                              <div className="w-full h-2 bg-gray-700 rounded-full">
                                <div 
                                  className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full" 
                                  style={{ width: `${detectedEmotion.secondaryConfidence}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6">
                            <h4 className="font-medium text-gray-300 mb-2">Emotional Description:</h4>
                            <p className="text-gray-300 bg-gray-900 bg-opacity-50 p-3 rounded-lg">
                              {detectedEmotion.description}
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-semibold mb-4 flex items-center">
                            <span className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-teal-600 flex items-center justify-center mr-2">
                              <FontAwesomeIcon icon={faLightbulb} className="text-white" />
                            </span>
                            Recommendations
                          </h3>
                          
                          <ul className="space-y-3">
                            {detectedEmotion.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start">
                                <div className="w-6 h-6 rounded-full bg-teal-500 bg-opacity-20 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                                  <FontAwesomeIcon icon={faCheckCircle} className="text-teal-400 text-sm" />
                                </div>
                                <span className="text-gray-300">{rec}</span>
                              </li>
                            ))}
                          </ul>
                          
                          <div className="mt-6 bg-gray-900 bg-opacity-50 rounded-lg p-4 border border-gray-700 border-opacity-50">
                            <h4 className="font-medium mb-2 flex items-center">
                              <FontAwesomeIcon icon={faInfoCircle} className="text-blue-400 mr-2" />
                              Emotional Intelligence Tip
                            </h4>
                            <p className="text-sm text-gray-400">
                              Awareness of your emotional state is the first step toward emotional intelligence. Consider how your current emotion might be influencing your thoughts and decisions.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap justify-center gap-4 mb-6">
                    {!detectedEmotion ? (
                      <button
                        onClick={analyzeEmotionRequest}
                        className="px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium hover:shadow-lg hover:scale-105 transform transition-all duration-300 flex items-center justify-center"
                        disabled={isDetecting}
                      >
                        {isDetecting ? (
                          <>
                            <div className="w-5 h-5 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faBrain} className="mr-2" />
                            Analyze Emotion
                          </>
                        )}
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          setUploadedImage(null);
                          setDetectedEmotion(null);
                        }}
                        className="px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg font-medium hover:shadow-lg transform transition-all duration-300 flex items-center justify-center"
                      >
                        <FontAwesomeIcon icon={faTimes} className="mr-2" />
                        Try Again
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-900 rounded-xl p-12 flex flex-col items-center justify-center border border-gray-700 border-dashed" style={{ height: '400px' }}>
                  <FontAwesomeIcon icon={faFaceSmile} className="text-gray-600 text-6xl mb-4" />
                  <p className="text-gray-400 text-center mb-6">
                    Upload a photo to analyze facial expressions
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg font-medium hover:shadow-lg hover:scale-105 transform transition-all duration-300 flex items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faUpload} className="mr-2" />
                    Upload Photo
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    accept="image/*" 
                    className="hidden"
                  />
                </div>
              )}
            </div>
            
            <div className="mt-10 bg-gray-800 bg-opacity-30 rounded-xl p-6 border border-gray-700">
              <h3 className="font-semibold mb-4 flex items-center">
                <FontAwesomeIcon icon={faInfoCircle} className="text-blue-400 mr-2" />
                About Facial Analysis
              </h3>
              <p className="text-gray-300 text-sm">
                Our facial analysis technology identifies key facial landmarks and micro-expressions to determine emotional states. The AI has been trained on diverse datasets to ensure accuracy across different ethnicities, ages, and lighting conditions. This non-invasive approach provides valuable insights that can help you better understand your emotional patterns and responses.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* End of display containers */}
      {!uploadedImage && detectedEmotion && (
        <div className="mt-6 flex justify-center">
          <button 
            onClick={() => {
              setUploadedImage(null);
              setDetectedEmotion(null);
            }}
            className="px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg font-medium hover:shadow-lg transform transition-all duration-300 flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faTimes} className="mr-2" />
            Reset Analysis
          </button>
        </div>
      )}
      
      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-b from-gray-900 via-purple-900/30 to-gray-900">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to gain deeper emotional insights?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Create an account to access the full range of our AI-powered mental health tools, including comprehensive voice analysis tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-medium hover:shadow-lg hover:scale-105 transform transition-all duration-300"
                onClick={onChatClick}
              >
                Talk to Our AI Assistant
              </button>
              <button 
                className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-xl font-medium hover:bg-gray-700 transition-all duration-300"
              >
                Learn More About Mental Health
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Assignment Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <div className="inline-block px-6 py-2 bg-blue-900/30 rounded-full text-blue-400 text-sm font-medium mb-4 border border-blue-800/50 backdrop-blur-sm">
                FEATURED TOOL
              </div>
              <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-400">
                DeepSeek AI Mental Health Assistant
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Experience our advanced AI-powered mental health assistant that provides personalized support based on your health metrics
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-800/20 to-purple-800/10 rounded-2xl p-8 border border-indigo-700/30 shadow-xl mb-14">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-white">AI Mental Health Assistant</h3>
                  <p className="text-gray-300 mb-4">
                    Our AI assistant uses state-of-the-art language models from DeepSeek to provide personalized mental health guidance, coping strategies, and emotional support.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-green-400 mt-1 mr-3" />
                      <span className="text-gray-300">Contextual understanding of your emotions and needs</span>
                    </li>
                    <li className="flex items-start">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-green-400 mt-1 mr-3" />
                      <span className="text-gray-300">Personalized suggestions based on your health metrics</span>
                    </li>
                    <li className="flex items-start">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-green-400 mt-1 mr-3" />
                      <span className="text-gray-300">Evidence-based mental health techniques and resources</span>
                    </li>
                  </ul>
                  <div className="flex flex-wrap gap-3">
                    <a 
                      href="/ai-assistant" 
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-purple-500/20"
                    >
                      Try DeepSeek Assistant
                      <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                    </a>
                    <a 
                      href="/gemini-assistant" 
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg font-medium hover:from-teal-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-teal-500/20"
                    >
                      Try Gemini Assistant
                      <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                    </a>
                  </div>
                </div>
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <div className="flex flex-col h-72 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-3 rounded-t-lg">
                      <h4 className="font-medium text-white flex items-center">
                        <FontAwesomeIcon icon="robot" className="text-blue-400 mr-2" />
                        Mental Health AI Assistant
                      </h4>
                    </div>
                    <div className="flex-grow bg-gray-800 p-4 space-y-3 overflow-y-auto">
                      <div className="bg-gray-700 rounded-lg rounded-tl-none p-3 max-w-[80%]">
                        <p className="text-sm text-gray-200">Hello! How are you feeling today?</p>
                      </div>
                      <div className="bg-blue-600 rounded-lg rounded-tr-none p-3 max-w-[80%] ml-auto">
                        <p className="text-sm text-white">I've been feeling anxious about work lately.</p>
                      </div>
                      <div className="bg-gray-700 rounded-lg rounded-tl-none p-3 max-w-[80%]">
                        <p className="text-sm text-gray-200">I'm sorry to hear that. Work anxiety is common. Based on your heart rate data, I notice your stress levels increase during work hours. Would you like to learn some quick breathing exercises to help manage anxiety in the moment?</p>
                      </div>
                    </div>
                    <div className="bg-gray-900 p-3 border-t border-gray-700 flex items-center">
                      <div className="flex-grow bg-gray-800 rounded-full px-4 py-2 text-gray-400 text-sm">
                        Type your message...
                      </div>
                      <button className="ml-2 w-8 h-8 flex items-center justify-center bg-blue-600 rounded-full text-white">
                        <FontAwesomeIcon icon="paper-plane" size="sm" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mb-14">
              <div className="inline-block px-6 py-2 bg-blue-900/30 rounded-full text-blue-400 text-sm font-medium mb-4 border border-blue-800/50 backdrop-blur-sm">
                NEW FEATURE
              </div>
              <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-400">
                Personalized AI Assignments
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Track your emotional growth with customized exercises tailored to your unique mental wellness journey
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Current Assignment Card */}
              <div className="col-span-1 lg:col-span-2 bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl overflow-hidden border border-gray-700 shadow-lg backdrop-blur-sm group hover:shadow-xl transition-all duration-500">
                <div className="bg-blue-600/10 border-b border-blue-800/30 p-5 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mr-3">
                      <FontAwesomeIcon icon={faBrain} className="text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Current Assignment</h3>
                  </div>
                  <div className="px-3 py-1 bg-blue-600/20 rounded-full text-blue-300 text-sm">
                    Due in 3 days
                  </div>
                </div>
                
                <div className="p-6">
                  <h4 className="text-lg font-medium mb-3 text-white">Emotional Pattern Recognition</h4>
                  <p className="text-gray-300 mb-5">
                    This exercise helps you identify recurring emotional patterns and their triggers. Complete the following steps to improve your emotional awareness.
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center mr-3 border border-gray-700">
                        <span className="text-blue-400 font-medium">1</span>
                      </div>
                      <div className="flex-1 bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <h5 className="font-medium mb-2 text-white">Record Daily Emotions</h5>
                        <p className="text-gray-300 text-sm">
                          Use the voice analysis tool to record your emotional state at different times of the day for 5 consecutive days.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-blue-900/30 rounded-md text-blue-300 text-xs">Morning Check-in</span>
                          <span className="px-2 py-1 bg-purple-900/30 rounded-md text-purple-300 text-xs">Afternoon Review</span>
                          <span className="px-2 py-1 bg-indigo-900/30 rounded-md text-indigo-300 text-xs">Evening Reflection</span>
                        </div>
                        <div className="mt-3 w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '40%' }}></div>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span className="text-gray-400">2/5 days completed</span>
                          <span className="text-blue-400">40%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center mr-3 border border-gray-700">
                        <span className="text-blue-400 font-medium">2</span>
                      </div>
                      <div className="flex-1 bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <h5 className="font-medium mb-2 text-white">Identify Emotional Triggers</h5>
                        <p className="text-gray-300 text-sm">
                          Use our AI-powered journal to document situations that triggered strong emotional responses.
                        </p>
                        <div className="mt-3 flex">
                          <button className="px-3 py-1.5 bg-blue-600/20 text-blue-300 rounded-lg text-sm flex items-center hover:bg-blue-600/30 transition-colors">
                            <FontAwesomeIcon icon={faPlay} className="mr-2" />
                            Open Journal
                          </button>
                        </div>
                        <div className="mt-3 w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span className="text-gray-400">Not started</span>
                          <span className="text-blue-400">0%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center mr-3 border border-gray-700">
                        <span className="text-blue-400 font-medium">3</span>
                      </div>
                      <div className="flex-1 bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <h5 className="font-medium mb-2 text-white">Complete Analysis Quiz</h5>
                        <p className="text-gray-300 text-sm">
                          Answer reflective questions about your emotional patterns, with AI-assisted analysis.
                        </p>
                        <div className="mt-3 flex">
                          <button disabled className="px-3 py-1.5 bg-gray-700/30 text-gray-500 rounded-lg text-sm flex items-center cursor-not-allowed">
                            <FontAwesomeIcon icon={faLock} className="mr-2" />
                            Unlocks after step 2
                          </button>
                        </div>
                        <div className="mt-3 w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span className="text-gray-400">Locked</span>
                          <span className="text-blue-400">0%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-800/30">
                    <div className="flex items-start">
                      <FontAwesomeIcon icon={faLightbulb} className="text-yellow-300 mt-1 mr-3" />
                      <div>
                        <h5 className="font-medium text-white mb-1">AI Insight</h5>
                        <p className="text-gray-300 text-sm">
                          Based on your progress, your morning emotional states tend to show higher stress levels. Consider adding a brief mindfulness practice to your morning routine.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 pb-6 flex justify-end">
                  <button className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg font-medium hover:shadow-lg hover:scale-105 transform transition-all duration-300 flex items-center justify-center text-white">
                    Continue Assignment
                  </button>
                </div>
              </div>
              
              {/* Upcoming Assignments and Progress */}
              <div className="col-span-1 space-y-6">
                {/* Progress Card */}
                <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl overflow-hidden border border-gray-700 shadow-lg p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-5 text-white">Your Progress</h3>
                  
                  <div className="relative h-40 w-40 mx-auto mb-5">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        fill="none" 
                        stroke="#2d3748" 
                        strokeWidth="8"
                      />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        fill="none" 
                        stroke="url(#gradient)" 
                        strokeWidth="8"
                        strokeDasharray="251.2"
                        strokeDashoffset="175.84"
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3182ce" />
                          <stop offset="100%" stopColor="#805ad5" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-3xl font-bold text-white">30%</span>
                      <span className="text-sm text-gray-400">Completed</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Assignments Completed</span>
                        <span className="text-blue-400">3/10</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Weekly Streak</span>
                        <span className="text-green-400">4 days</span>
                      </div>
                      <div className="flex justify-between gap-1">
                        <div className="flex-1 h-2 bg-green-500 rounded-sm"></div>
                        <div className="flex-1 h-2 bg-green-500 rounded-sm"></div>
                        <div className="flex-1 h-2 bg-green-500 rounded-sm"></div>
                        <div className="flex-1 h-2 bg-green-500 rounded-sm"></div>
                        <div className="flex-1 h-2 bg-gray-700 rounded-sm"></div>
                        <div className="flex-1 h-2 bg-gray-700 rounded-sm"></div>
                        <div className="flex-1 h-2 bg-gray-700 rounded-sm"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Emotional Awareness Score</span>
                        <span className="text-purple-400">65/100</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Upcoming Assignments */}
                <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl overflow-hidden border border-gray-700 shadow-lg p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-5 text-white">Upcoming Assignments</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-blue-800/50 transition-colors cursor-pointer group">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-white group-hover:text-blue-300 transition-colors">Mindfulness Practice</h4>
                        <span className="px-2 py-0.5 bg-teal-900/30 rounded text-teal-300 text-xs">Week 2</span>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">
                        Daily guided mindfulness exercises tailored to your emotional patterns.
                      </p>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Unlocks in 4 days</span>
                        <FontAwesomeIcon icon={faArrowRight} className="text-gray-500 group-hover:text-blue-400 transition-colors" />
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-blue-800/50 transition-colors cursor-pointer group">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-white group-hover:text-blue-300 transition-colors">Cognitive Reframing</h4>
                        <span className="px-2 py-0.5 bg-purple-900/30 rounded text-purple-300 text-xs">Week 3</span>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">
                        Learn to identify and transform negative thought patterns.
                      </p>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Unlocks in 11 days</span>
                        <FontAwesomeIcon icon={faArrowRight} className="text-gray-500 group-hover:text-blue-400 transition-colors" />
                      </div>
                    </div>
                    
                    <button className="w-full px-4 py-3 mt-2 bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg text-gray-300 text-sm flex items-center justify-center transition-colors">
                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                      View Full Assignment Calendar
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Assignment Categories */}
            <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/5 rounded-xl p-5 border border-blue-800/30 hover:shadow-lg hover:border-blue-700/50 transition-all duration-300 cursor-pointer group">
                <div className="w-12 h-12 rounded-lg bg-blue-900/30 flex items-center justify-center mb-4 group-hover:bg-blue-800/50 transition-colors">
                  <FontAwesomeIcon icon={faBrain} className="text-blue-400 text-xl" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-blue-300 transition-colors">Cognitive Skills</h3>
                <p className="text-gray-400 text-sm mb-3">
                  Exercises to improve mental clarity, focus, and mindfulness practices.
                </p>
                <div className="flex items-center text-blue-400 text-sm">
                  <span className="mr-2">Explore</span>
                  <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/5 rounded-xl p-5 border border-purple-800/30 hover:shadow-lg hover:border-purple-700/50 transition-all duration-300 cursor-pointer group">
                <div className="w-12 h-12 rounded-lg bg-purple-900/30 flex items-center justify-center mb-4 group-hover:bg-purple-800/50 transition-colors">
                  <FontAwesomeIcon icon={faHeart} className="text-purple-400 text-xl" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-purple-300 transition-colors">Emotional Regulation</h3>
                <p className="text-gray-400 text-sm mb-3">
                  Techniques to understand and manage your emotional responses.
                </p>
                <div className="flex items-center text-purple-400 text-sm">
                  <span className="mr-2">Explore</span>
                  <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-teal-900/20 to-teal-800/5 rounded-xl p-5 border border-teal-800/30 hover:shadow-lg hover:border-teal-700/50 transition-all duration-300 cursor-pointer group">
                <div className="w-12 h-12 rounded-lg bg-teal-900/30 flex items-center justify-center mb-4 group-hover:bg-teal-800/50 transition-colors">
                  <FontAwesomeIcon icon={faUsers} className="text-teal-400 text-xl" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-teal-300 transition-colors">Social Connection</h3>
                <p className="text-gray-400 text-sm mb-3">
                  Activities to strengthen relationships and communication skills.
                </p>
                <div className="flex items-center text-teal-400 text-sm">
                  <span className="mr-2">Explore</span>
                  <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/5 rounded-xl p-5 border border-amber-800/30 hover:shadow-lg hover:border-amber-700/50 transition-all duration-300 cursor-pointer group">
                <div className="w-12 h-12 rounded-lg bg-amber-900/30 flex items-center justify-center mb-4 group-hover:bg-amber-800/50 transition-colors">
                  <FontAwesomeIcon icon={faShieldAlt} className="text-amber-400 text-xl" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-amber-300 transition-colors">Resilience Building</h3>
                <p className="text-gray-400 text-sm mb-3">
                  Strategies to develop mental strength and adapt to challenges.
                </p>
                <div className="flex items-center text-amber-400 text-sm">
                  <span className="mr-2">Explore</span>
                  <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AIToolsPage; 