
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createComplaint } from '../../store/slices/complaintSlice';
import { AppDispatch } from '../../store/store';
import { useTheme } from '../../contexts/ThemeContext';
import { Camera, MapPin, AlertCircle, Send } from 'lucide-react';

const CreateComplaintPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    images: [] as File[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Air Pollution',
    'Water Pollution',
    'Noise Pollution',
    'Waste Management',
    'Illegal Dumping',
    'Deforestation',
    'Industrial Waste',
    'Other'
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-600 dark:text-green-400' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600 dark:text-yellow-400' },
    { value: 'high', label: 'High', color: 'text-red-600 dark:text-red-400' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await dispatch(createComplaint(formData)).unwrap();
      navigate('/complaints/my');
    } catch (error) {
      console.error('Failed to create complaint:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Report Environmental Issue</h1>
        <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Help make a difference by reporting environmental concerns in your area.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Issue Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="Brief description of the issue"
            className={`
              w-full px-4 py-3 rounded-xl border transition-colors duration-200
              ${isDarkMode 
                ? 'bg-gray-800 border-gray-700 focus:border-blue-500' 
                : 'bg-white border-gray-300 focus:border-blue-500'
              }
              focus:outline-none focus:ring-4 focus:ring-blue-500/20
            `}
          />
        </div>

        {/* Category & Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className={`
                w-full px-4 py-3 rounded-xl border transition-colors duration-200
                ${isDarkMode 
                  ? 'bg-gray-800 border-gray-700 focus:border-blue-500' 
                  : 'bg-white border-gray-300 focus:border-blue-500'
                }
                focus:outline-none focus:ring-4 focus:ring-blue-500/20
              `}
            >
              <option value="">Select category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Priority Level
            </label>
            <div className="flex space-x-4">
              {priorities.map(priority => (
                <label key={priority.value} className="flex items-center">
                  <input
                    type="radio"
                    name="priority"
                    value={priority.value}
                    checked={formData.priority === priority.value}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-colors duration-200
                    ${formData.priority === priority.value
                      ? isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-700'
                      : isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                    }
                  `}>
                    <AlertCircle className={`w-4 h-4 ${priority.color}`} />
                    <span className="text-sm font-medium">{priority.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Location *
          </label>
          <div className="relative">
            <MapPin className={`
              absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5
              ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
            `} />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              placeholder="Enter the location of the issue"
              className={`
                w-full pl-12 pr-4 py-3 rounded-xl border transition-colors duration-200
                ${isDarkMode 
                  ? 'bg-gray-800 border-gray-700 focus:border-blue-500' 
                  : 'bg-white border-gray-300 focus:border-blue-500'
                }
                focus:outline-none focus:ring-4 focus:ring-blue-500/20
              `}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Detailed Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={5}
            placeholder="Provide detailed information about the environmental issue..."
            className={`
              w-full px-4 py-3 rounded-xl border transition-colors duration-200 resize-none
              ${isDarkMode 
                ? 'bg-gray-800 border-gray-700 focus:border-blue-500' 
                : 'bg-white border-gray-300 focus:border-blue-500'
              }
              focus:outline-none focus:ring-4 focus:ring-blue-500/20
            `}
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Supporting Images
          </label>
          <div className={`
            border-2 border-dashed rounded-xl p-6 text-center transition-colors duration-200
            ${isDarkMode 
              ? 'border-gray-700 hover:border-gray-600' 
              : 'border-gray-300 hover:border-gray-400'
            }
          `}>
            <Camera className={`
              mx-auto w-12 h-12 mb-4
              ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
            `} />
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className={`
                cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors duration-200
                ${isDarkMode 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              Choose Images
            </label>
            <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Upload photos to support your report
            </p>
          </div>

          {/* Image Preview */}
          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors duration-200"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`
            w-full flex items-center justify-center space-x-2 py-4 rounded-xl font-semibold
            transition-all duration-200 transform
            ${isSubmitting
              ? isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-300 text-gray-500'
              : isDarkMode 
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02]' 
                : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-[1.02]'
            }
            focus:outline-none focus:ring-4 focus:ring-blue-500/20
            active:scale-[0.98]
          `}
        >
          <Send className="w-5 h-5" />
          <span>{isSubmitting ? 'Submitting...' : 'Submit Report'}</span>
        </button>
      </form>
    </div>
  );
};

export default CreateComplaintPage;
