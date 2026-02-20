import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  StarIcon, 
  CheckCircleIcon,
  FunnelIcon,
  UserCircleIcon,
  WrenchIcon,
  XMarkIcon,
  ClockIcon,
  PhoneIcon,
  SparklesIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { 
  StarIcon as StarIconSolid,
  CheckCircleIcon as CheckCircleIconSolid,
  SparklesIcon as SparklesIconSolid
} from '@heroicons/react/24/solid';

const ViewAllWorkers = () => {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('rating'); // rating, price, experience
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // all, available, busy
  const navigate = useNavigate();
  // Available skills for filtering
  const allSkills = [
    'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Cleaning',
    'AC Repair', 'Appliance Repair', 'Pest Control', 'Gardening',
    'Carpet Cleaning', 'Moving', 'Computer Repair', 'Phone Repair',
    'Home Renovation', 'Flooring', 'Roofing', 'Masonry', 'Welding'
  ];

const fetchWorkers = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token"); // adjust if stored differently

      const res = await axios.get(
        "http://localhost:5000/api/customer/getWorkerProfiles",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.success) {
        setWorkers(res.data.workers);
        setFilteredWorkers(res.data.workers);
      }

    } catch (error) {
      console.error("Fetch Workers Error:", error);
    } finally {
      setLoading(false);
    }
}

useEffect(() => {
  fetchWorkers();
}, []);
  // Filter workers based on search criteria
  useEffect(() => {
    let result = [...workers];

    // Filter by search query (name or service)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(worker =>
        worker.name.toLowerCase().includes(query) ||
        worker.serviceName.toLowerCase().includes(query) ||
        worker.description.toLowerCase().includes(query)
      );
    }

    // Filter by location
    if (location) {
      result = result.filter(worker =>
        worker.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Filter by skills
    if (selectedSkills.length > 0) {
      result = result.filter(worker =>
        selectedSkills.some(skill =>
          worker.skills.some(workerSkill =>
            workerSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    // Filter by availability
    if (availabilityFilter === 'available') {
      result = result.filter(worker => worker.isAvailable);
    } else if (availabilityFilter === 'busy') {
      result = result.filter(worker => !worker.isAvailable);
    }

    // Sort results
    result.sort((a, b) => {
      if (sortBy === 'rating') {
        return (b.rating || 0)- (a.rating || 0);
      } else if (sortBy === 'experience') {
        const expA = parseInt(a.experience);
        const expB = parseInt(b.experience);
        return expB - expA;
      }
      return 0;
    });

    setFilteredWorkers(result);
  }, [searchQuery, location, selectedSkills, workers, sortBy, availabilityFilter]);

  // Handle skill selection
  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setLocation('');
    setSelectedSkills([]);
    setSortBy('rating');
    setAvailabilityFilter('all');
  };

  // Handle worker selection
  const handleWorkerSelect = (workerId) => {
    alert(`Booking worker with ID: ${workerId}`);
    // In real app: navigate to booking page or open modal
  };

  // Render stars
  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <StarIconSolid
        key={index}
        className={`h-4 w-4 ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };
console.log(workers)
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EFECE3] to-[#EAE0CF]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#213448] to-[#4A70A9] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-2">
            Find Professional Workers
          </h1>
          <p className="text-center text-[#94B4C1]">
            Search for skilled workers by name, location, or skills
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-[#EAE0CF]">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
            {/* Search by name/service */}
            <div>
              <label className="block text-sm font-medium text-[#213448] mb-2">
                <div className="flex items-center">
                  <UserCircleIcon className="h-4 w-4 mr-2 text-[#4A70A9]" />
                  Search Worker
                </div>
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#547792]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Name or service..."
                  className="w-full pl-10 pr-4 py-3 border border-[#EAE0CF] rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-[#4A70A9] text-[#213448]"
                />
              </div>
            </div>

            {/* Search by location */}
            <div>
              <label className="block text-sm font-medium text-[#213448] mb-2">
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-2 text-[#4A70A9]" />
                  Location
                </div>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#547792]" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Area or city..."
                  className="w-full pl-10 pr-4 py-3 border border-[#EAE0CF] rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-[#4A70A9] text-[#213448]"
                />
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-[#213448] mb-2">
                <div className="flex items-center">
                  <SparklesIcon className="h-4 w-4 mr-2 text-[#4A70A9]" />
                  Sort By
                </div>
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-[#EAE0CF] rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-[#4A70A9] text-[#213448]"
              >
                <option value="rating">Highest Rating</option>
                <option value="experience">Most Experienced</option>
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <label className="block text-sm font-medium text-[#213448] mb-2">
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-2 text-[#4A70A9]" />
                  Availability
                </div>
              </label>
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="w-full px-4 py-3 border border-[#EAE0CF] rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-[#4A70A9] text-[#213448]"
              >
                <option value="all">All Workers</option>
                <option value="available">Available Now</option>
                <option value="busy">Currently Busy</option>
              </select>
            </div>
          </div>

          {/* Skills Filter */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-[#213448] flex items-center">
                <WrenchIcon className="h-4 w-4 mr-2 text-[#4A70A9]" />
                Filter by Skills
              </label>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-sm text-[#4A70A9] hover:text-[#213448] flex items-center"
              >
                <FunnelIcon className="h-4 w-4 mr-1" />
                {showFilters ? 'Hide Skills' : 'Show Skills'}
              </button>
            </div>

            {showFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {allSkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedSkills.includes(skill)
                        ? 'bg-[#4A70A9] text-white'
                        : 'bg-[#EFECE3] text-[#213448] hover:bg-[#EAE0CF] border border-[#EAE0CF]'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            )}

            {/* Selected Skills */}
            {selectedSkills.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#547792]">Selected Skills:</span>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-500 hover:text-red-700 flex items-center"
                  >
                    <XMarkIcon className="h-4 w-4 mr-1" />
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-[#94B4C1] text-white rounded-full text-sm flex items-center"
                    >
                      {skill}
                      <button
                        onClick={() => toggleSkill(skill)}
                        className="ml-2 hover:text-gray-200"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Summary */}
          <div className="mt-4 pt-4 border-t border-[#EAE0CF]">
            <div className="flex justify-between items-center">
              <p className="text-[#213448] font-medium">
                Found <span className="text-[#4A70A9] font-bold">{filteredWorkers.length}</span> workers
                {selectedSkills.length > 0 && ` with ${selectedSkills.length} selected skills`}
              </p>
              <div className="flex items-center space-x-2 text-sm text-[#547792]">
                <FunnelIcon className="h-4 w-4" />
                <span>Active Filters: {selectedSkills.length + (location ? 1 : 0) + (searchQuery ? 1 : 0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Workers Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A70A9]"></div>
            <p className="ml-4 text-[#213448]">Loading workers...</p>
          </div>
        ) : filteredWorkers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow border border-[#EAE0CF]">
            <UserCircleIcon className="h-16 w-16 text-[#94B4C1] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#213448] mb-2">No workers found</h3>
            <p className="text-[#547792] mb-4">Try adjusting your search criteria or filters</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-[#4A70A9] text-white rounded-lg hover:bg-[#213448] transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkers.map((worker) => (
              <div
                key={worker.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#EAE0CF] hover:shadow-xl transition-shadow duration-300"
              >
                {/* Worker Header */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={`http://localhost:5000${worker.profilePhoto}`}
                          alt={worker.name}
                          className="h-16 w-16 rounded-full border-2 border-white object-cover"
                        />
                        {worker.isVerified && (
                          <div className="absolute -bottom-1 -right-1 bg-[#94B4C1] text-white rounded-full p-1">
                            <ShieldCheckIcon className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-[#213448] text-lg">{worker.name}</h3>
                        <p className="text-[#4A70A9] font-medium text-sm">{worker.serviceName}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      worker.isAvailable 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {worker.isAvailable ? 'Available' : 'Busy'}
                    </div>
                  </div>
                </div>

                {/* Worker Details */}
                <div className="p-4">
                  {/* Rating and Experience */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <div className="flex">
                        {renderStars(worker.rating)}
                      </div>
                      <span className="ml-2 font-bold text-[#213448]">{worker.rating}</span>
                      <span className="ml-1 text-sm text-[#547792]">({worker.totalJobs} jobs)</span>
                    </div>
                    <div className="text-sm text-[#547792] bg-[#EFECE3] px-3 py-1 rounded-full">
                      {worker.experience} exp
                    </div>
                  </div>

                  {/* Location and Response Time */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-[#547792]">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      {worker.location}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-[#213448] mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {worker.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-[#EFECE3] text-[#213448] rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                      {worker.skills.length > 3 && (
                        <span className="px-2 py-1 bg-[#EAE0CF] text-[#547792] rounded-full text-xs">
                          +{worker.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>



                  {/* Description */}
                  <p className="text-sm text-[#547792] mb-6 line-clamp-2">
                    {worker.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/createbookingform/${worker.userId.email}`)}
                      disabled={!worker.isAvailable}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                        worker.isAvailable
                          ? 'bg-gradient-to-r from-[#4A70A9] to-[#213448] text-white hover:from-[#213448] hover:to-[#4A70A9]'
                          : 'bg-[#EAE0CF] text-[#547792] cursor-not-allowed'
                      }`}
                    >
                      {worker.isAvailable ? 'Book Now' : 'Not Available'}
                    </button>
                    <button className="px-4 py-2 border border-[#4A70A9] text-[#4A70A9] rounded-lg hover:bg-[#EFECE3] transition-colors" 
                    onClick={() => {navigate(`/viewworkerprofile/${worker.userId._id}`)}}>
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats Footer */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-[#4A70A9] to-[#213448] rounded-xl p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Workers Available</p>
                <p className="text-2xl font-bold mt-1">{workers.filter(w => w.isAvailable).length}</p>
              </div>
              <UserCircleIcon className="h-10 w-10 opacity-70" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#BFABD4] to-[#4A70A9] rounded-xl p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Verified Workers</p>
                <p className="text-2xl font-bold mt-1">{workers.filter(w => w.isVerified).length}</p>
              </div>
              <ShieldCheckIcon className="h-10 w-10 opacity-70" />
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-white rounded-2xl shadow p-6 border border-[#EAE0CF]">
          <h3 className="text-lg font-semibold text-[#213448] mb-4 flex items-center">
            <SparklesIconSolid className="h-5 w-5 mr-2 text-[#BFABD4]" />
            Tips for Finding the Right Worker
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#EFECE3] rounded-lg">
              <div className="text-[#4A70A9] font-semibold mb-2">1. Check Ratings</div>
              <p className="text-sm text-[#547792]">Look for workers with high ratings and many completed jobs.</p>
            </div>
            <div className="p-4 bg-[#EFECE3] rounded-lg">
              <div className="text-[#4A70A9] font-semibold mb-2">2. Verify Skills</div>
              <p className="text-sm text-[#547792]">Make sure the worker has the specific skills you need.</p>
            </div>
            <div className="p-4 bg-[#EFECE3] rounded-lg">
              <div className="text-[#4A70A9] font-semibold mb-2">3. Read Descriptions</div>
              <p className="text-sm text-[#547792]">Check worker descriptions for their experience and specialties.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAllWorkers;