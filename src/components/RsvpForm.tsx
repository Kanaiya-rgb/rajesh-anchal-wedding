import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Loader, User, PhoneCall, Users, Heart, Sparkles } from 'lucide-react';
import { RSVP } from '../types';
import { submitRsvpToSheets } from '../googleSheets';

interface RsvpFormProps {
  lang?: 'en' | 'hi' | 'mix';
}

const ceremonyOptionsEn = [
  { id: 'Haldi', label: 'Shubh Haldi (February 21, 2027)' },
  { id: 'Wedding', label: 'Shubh Vivah (February 22, 2027)' },
  { id: 'Vidai', label: 'Shubh Vidai (February 23, 2027)' },
];

const ceremonyOptionsMix = [
  { id: 'Haldi', label: 'शुभ हल्दी (Haldi Ceremony - Feb 21)' },
  { id: 'Wedding', label: 'शुभ विवाह (Sacred Wedding - Feb 22)' },
  { id: 'Vidai', label: 'शुभ विदाई (Farewell Ceremony - Feb 23)' },
];

const ceremonyOptionsHi = [
  { id: 'Haldi', label: 'शुभ हल्दी (21 फरवरी 2027)' },
  { id: 'Wedding', label: 'शुभ विवाह (22 फरवरी 2027)' },
  { id: 'Vidai', label: 'शुभ विदाई (23 फरवरी 2027)' },
];

export default function RsvpForm({ lang = 'hi' }: RsvpFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneOrEmail: '',
    attendingEvents: [] as string[],
    guestsCount: 1,
    foodPreference: 'veg' as 'veg' | 'non-veg' | 'jain',
    specialMessage: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ceremonyOptions = lang === 'en' ? ceremonyOptionsEn : lang === 'mix' ? ceremonyOptionsMix : ceremonyOptionsHi;

  const toggleEvent = (eventId: string) => {
    setFormData((prev) => {
      const attending = prev.attendingEvents.includes(eventId)
        ? prev.attendingEvents.filter((id) => id !== eventId)
        : [...prev.attendingEvents, eventId];
      return { ...prev, attendingEvents: attending };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setError(lang === 'en' ? 'Please provide your auspicious name.' : lang === 'mix' ? 'कृपया अपना शुभ नाम दर्ज करें (Please enter your name)' : 'कृपया अपना शुभ नाम दर्ज करें।');
      return;
    }
    if (formData.attendingEvents.length === 0) {
      setError(
        lang === 'en' 
          ? 'Please select at least one ceremony you will bless with your presence.' 
          : lang === 'mix'
            ? 'कृपया कम से कम एक समारोह चुनें जिसमें आप सम्मिलित होंगे (Please select a ceremony)'
            : 'कृपया कम से कम एक समारोह चुनें जिसमें आप सम्मिलित होंगे।'
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const rsvpData: RSVP = {
        fullName: formData.fullName,
        phoneOrEmail: formData.phoneOrEmail,
        attendingEvents: formData.attendingEvents,
        guestsCount: Number(formData.guestsCount),
        foodPreference: formData.foodPreference,
        specialMessage: formData.specialMessage,
        submittedAt: new Date(),
      };

      await submitRsvpToSheets(rsvpData);

      setSuccess(true);
    } catch (err: any) {
      console.error('Error saving RSVP to Sheets:', err);
      setError(lang === 'en' ? 'A minor obstacle occurred. Please try again.' : lang === 'mix' ? 'त्रुटि हुई। कृपया पुनः प्रयास करें (Error. Please retry)' : 'त्रुटि हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 px-2 max-w-xl mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white border-4 border-royal-gold rounded-3xl p-5 md:p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Traditional marigold flowers hanging design */}
        <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-marigold-orange via-marigold-yellow to-marigold-orange" />
        <div className="absolute top-3 inset-x-0 flex justify-around pointer-events-none text-marigold-orange opacity-60">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-1 h-3 bg-marigold-orange/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-marigold-yellow border border-marigold-orange" />
            </div>
          ))}
        </div>

        <div className="text-center pt-4 mb-6">
          <span className="text-saffron font-wedding-devanagari text-base tracking-widest block mb-1 font-bold">
            {lang === 'mix' ? '॥ आर एस वी पी / उपस्थिति सूचना ॥' : lang === 'en' ? 'आर एस वी पी' : '॥ आमंत्रण उत्तर ॥'}
          </span>
          <h3 className="text-wedding-maroon font-wedding-display text-2xl md:text-3xl font-extrabold tracking-wide">
            {lang === 'mix' ? 'उपस्थिति स्वीकृति / RSVP Response' : lang === 'en' ? 'Response & RSVP' : 'उपस्थिति स्वीकृति (RSVP)'}
          </h3>
          <p className="text-gray-500 font-wedding-serif text-xs md:text-sm mt-1.5 leading-relaxed px-4">
            {lang === 'mix' ? (
              <span className="block space-y-1">
                <span className="block font-wedding-devanagari text-wedding-maroon text-[13px] font-semibold leading-relaxed">
                  भोजन एवं सत्कार व्यवस्था की सुगमता हेतु कृपया 10 फरवरी 2027 से पहले अपनी स्वीकृति दर्ज करें।
                </span>
                <span className="block text-[11px] text-gray-400 font-medium italic leading-normal">
                  "Please respond before February 10, 2027 so we may arrange the feast."
                </span>
              </span>
            ) : lang === 'en' ? (
              'Please respond before February 10, 2027 so we may arrange the feast.'
            ) : (
              'भोजन एवं सत्कार व्यवस्था की सुगमता हेतु कृपया 10 फरवरी 2027 से पहले अपनी स्वीकृति दर्ज करें।'
            )}
          </p>
          <div className="w-16 h-0.5 bg-royal-gold/50 mx-auto mt-3" />
        </div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-6 px-4"
          >
            <div className="w-14 h-14 bg-wedding-maroon text-bright-gold rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-royal-gold shadow-lg animate-bounce">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>
            <h4 className="text-wedding-maroon font-wedding-display text-lg md:text-xl font-bold">
              {lang === 'mix' ? 'धन्यवाद! (Thank You!)' : lang === 'en' ? 'Thank You!' : 'धन्यवाद! सादर धन्यवाद!'}
            </h4>
            <p className="text-gray-600 font-wedding-serif text-xs md:text-sm mt-3 leading-relaxed px-2">
              {lang === 'mix' ? (
                <span className="block space-y-2">
                  <span className="block font-wedding-devanagari text-wedding-maroon font-bold">
                    "आपकी उपस्थिति स्वीकृति सफलतापूर्वक दर्ज कर ली गई है। हम आदर के साथ मांगलिक उत्सव में आपका स्वागत करने के लिए उत्सुक हैं!"
                  </span>
                  <span className="block text-xs text-gray-500 font-medium italic">
                    "Your respectful RSVP has been securely registered. We are eagerly looking forward to welcoming you with a warm heart!"
                  </span>
                </span>
              ) : lang === 'en' ? (
                'Your respectful RSVP has been securely registered. We are eagerly looking forward to welcoming you to the royal celebrations with a warm heart!'
              ) : (
                'आपकी उपस्थिति स्वीकृति सफलतापूर्वक दर्ज कर ली गई है। हम अत्यंत हर्ष और आदर के साथ मांगलिक उत्सव में आपका स्वागत करने के लिए उत्सुक हैं!'
              )}
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium text-center">
                {error}
              </div>
            )}

            {/* Guest Name */}
            <div>
              <label className="block text-xs font-bold text-wedding-maroon uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-royal-gold" />
                {lang === 'en' ? 'Auspicious Name *' : lang === 'mix' ? 'आपका शुभ नाम (Auspicious Name) *' : 'आपका शुभ नाम (Name) *'}
              </label>
              <input
                type="text"
                required
                placeholder={lang === 'en' ? 'Enter your full name' : lang === 'mix' ? 'अपना शुभ नाम दर्ज करें (Enter full name)' : 'अपना शुभ नाम दर्ज करें'}
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-royal-gold focus:ring-2 focus:ring-royal-gold/20 outline-none text-xs md:text-sm transition-all duration-200"
              />
            </div>

            {/* Contact Info */}
            <div>
              <label className="block text-xs font-bold text-wedding-maroon uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5 text-royal-gold" />
                {lang === 'en' ? 'Phone Number / Email *' : lang === 'mix' ? 'मोबाइल नंबर / ईमेल (Contact) *' : 'मोबाइल नंबर / ईमेल (Contact) *'}
              </label>
              <input
                type="text"
                required
                placeholder={lang === 'en' ? 'Enter phone number or email' : lang === 'mix' ? 'मोबाइल नंबर अथवा ईमेल दर्ज करें (Enter phone/email)' : 'मोबाइल नंबर अथवा ईमेल दर्ज करें'}
                value={formData.phoneOrEmail}
                onChange={(e) => setFormData({ ...formData, phoneOrEmail: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-royal-gold focus:ring-2 focus:ring-royal-gold/20 outline-none text-xs md:text-sm transition-all duration-200"
              />
            </div>

            {/* Attending Events */}
            <div>
              <label className="block text-xs font-bold text-wedding-maroon uppercase tracking-wider mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-royal-gold" />
                {lang === 'en' ? 'Select Ceremonies to Attend *' : lang === 'mix' ? 'सम्मिलित होने वाले समारोह (Ceremonies) *' : 'सम्मिलित होने वाले समारोह *'}
              </label>
              <div className="grid grid-cols-1 gap-2">
                {ceremonyOptions.map((option) => {
                  const isChecked = formData.attendingEvents.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => toggleEvent(option.id)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold border text-left transition-all duration-200 flex items-center justify-between cursor-pointer ${
                        isChecked
                          ? 'bg-wedding-maroon text-white border-royal-gold'
                          : 'bg-gray-50 text-wedding-maroon border-gray-200 hover:bg-temple-cream'
                      }`}
                    >
                      <span>{option.label}</span>
                      {isChecked ? (
                        <div className="w-4 h-4 rounded-full bg-bright-gold text-wedding-maroon flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Guests Count & Food preference */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-wedding-maroon uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-royal-gold" />
                  {lang === 'en' ? 'Total Guests attending *' : lang === 'mix' ? 'कुल सदस्य संख्या (Total Guests) *' : 'कुल सदस्य संख्या *'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  required
                  value={formData.guestsCount}
                  onChange={(e) => setFormData({ ...formData, guestsCount: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-royal-gold focus:ring-2 focus:ring-royal-gold/20 outline-none text-xs md:text-sm transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-wedding-maroon uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-royal-gold" />
                  {lang === 'en' ? 'Feast Preference *' : lang === 'mix' ? 'भोजन वरीयता (Feast Preference) *' : 'भोजन व्यवस्था वरीयता *'}
                </label>
                <select
                  value={formData.foodPreference}
                  onChange={(e) => setFormData({ ...formData, foodPreference: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-royal-gold focus:ring-2 focus:ring-royal-gold/20 outline-none text-xs md:text-sm transition-all duration-200 bg-white"
                >
                  <option value="veg">{lang === 'en' ? 'Pure Vegetarian' : lang === 'mix' ? 'शुद्ध शाकाहारी (Pure Veg)' : 'शुद्ध शाकाहारी (Veg)'}</option>
                  <option value="jain">{lang === 'en' ? 'Jain Feast' : lang === 'mix' ? 'जैन भोजन (Jain Feast)' : 'जैन भोजन (Jain)'}</option>
                  <option value="non-veg">{lang === 'en' ? 'Non-Vegetarian' : lang === 'mix' ? 'सामान्य भोजन (Standard Feast)' : 'सामान्य (Non-Veg)'}</option>
                </select>
              </div>
            </div>

            {/* Special Message */}
            <div className="mt-4">
              <label className="block text-xs font-bold text-wedding-maroon uppercase tracking-wider mb-1.5">
                {lang === 'en' ? 'Blessing / Dietary Notes' : lang === 'mix' ? 'दंपत्ति को शुभकामनाएं / विशिष्ट निर्देश (Blessings / Notes)' : 'दंपत्ति को शुभकामनाएं / विशिष्ट निर्देश'}
              </label>
              <textarea
                rows={2}
                placeholder={lang === 'en' ? 'Write a loving note for the couple...' : lang === 'mix' ? 'नव-दंपत्ति के लिए संदेश लिखें... (Write a loving note...)' : 'नव-दंपत्ति के लिए अपना स्नेहपूर्ण संदेश लिखें...'}
                value={formData.specialMessage}
                onChange={(e) => setFormData({ ...formData, specialMessage: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-royal-gold focus:ring-2 focus:ring-royal-gold/20 outline-none text-xs md:text-sm transition-all duration-200"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-wedding-crimson to-wedding-maroon hover:from-wedding-maroon hover:to-wedding-maroon text-white py-3 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-200 border border-royal-gold shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin text-bright-gold" />
                  {lang === 'en' ? 'Submitting RSVP...' : lang === 'mix' ? 'स्वीकृति भेजी जा रही है (Submitting RSVP)...' : 'स्वीकृति दर्ज की जा रही है...'}
                </>
              ) : (
                lang === 'en' ? 'Accept Invitation (RSVP)' : lang === 'mix' ? 'आमंत्रण स्वीकारें (Accept RSVP)' : 'आमंत्रण स्वीकारें (दर्ज करें)'
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
