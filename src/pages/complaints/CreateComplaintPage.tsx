
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Camera, MapPin, AlertCircle, Send } from 'lucide-react';

const CreateComplaintPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    images: [] as File[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        images: Array.from(e.target.files || [])
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('location', formData.location);
      submitData.append('priority', formData.priority);
      
      formData.images.forEach((image, index) => {
        submitData.append(`images`, image);
      });

      // TODO: Replace with actual API call
      console.log('Submitting complaint:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate('/complaints');
    } catch (error) {
      console.error('Error submitting complaint:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-black' : 'bg-gray-50'
    }`}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-semibold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Report Environmental Issue
          </h1>
          <p className={`text-base ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Help make your community cleaner and safer
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Issue Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                isDarkMode 
                  ? 'bg-gray-900 border-gray-700 text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              } focus:outline-none focus:ring-0`}
              placeholder="Brief description of the issue"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                isDarkMode 
                  ? 'bg-gray-900 border-gray-700 text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              } focus:outline-none focus:ring-0`}
              required
            >
              <option value="">Select a category</option>
              <option value="waste">Waste Management</option>
              <option value="pollution">Pollution</option>
              <option value="water">Water Issues</option>
              <option value="noise">Noise Pollution</option>
              <option value="air">Air Quality</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <MapPin className="inline w-4 h-4 mr-1" />
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                isDarkMode 
                  ? 'bg-gray-900 border-gray-700 text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              } focus:outline-none focus:ring-0`}
              placeholder="Where is this issue located?"
              required
            />
          </div>

          {/* Priority */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <AlertCircle className="inline w-4 h-4 mr-1" />
              Priority Level
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                isDarkMode 
                  ? 'bg-gray-900 border-gray-700 text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              } focus:outline-none focus:ring-0`}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Detailed Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-3 rounded-xl border transition-colors resize-none ${
                isDarkMode 
                  ? 'bg-gray-900 border-gray-700 text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              } focus:outline-none focus:ring-0`}
              placeholder="Provide more details about the environmental issue..."
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <Camera className="inline w-4 h-4 mr-1" />
              Upload Images (Optional)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                isDarkMode 
                  ? 'bg-gray-900 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium ${
                isDarkMode 
                  ? 'file:bg-gray-800 file:text-gray-300' 
                  : 'file:bg-gray-100 file:text-gray-700'
              }`}
            />
            {formData.images.length > 0 && (
              <p className={`text-sm mt-2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {formData.images.length} image(s) selected
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
              isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Submit Report</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateComplaintPage;
