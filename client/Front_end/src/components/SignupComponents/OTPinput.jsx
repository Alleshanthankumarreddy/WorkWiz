import React, { useRef, useState, useEffect } from "react";

const OTPInput = ({
  length = 6,
  value,
  onChange,
  className,
}) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    // Sync external value with internal state
    const valueArray = value.split("").slice(0, length);
    const newOtp = new Array(length).fill("");
    valueArray.forEach((char, index) => {
      newOtp[index] = char;
    });
    setOtp(newOtp);
  }, [value, length]);

  const handleChange = (index, e) => {
    const inputValue = e.target.value;

    // Allow only digits
    if (!/^\d*$/.test(inputValue)) return;

    const newOtp = [...otp];
    // Take only last character
    newOtp[index] = inputValue.slice(-1);
    setOtp(newOtp);
    onChange(newOtp.join(""));

    // Auto focus next input
    if (inputValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    const newOtp = new Array(length).fill("");
    pastedData.split("").forEach((char, index) => {
      newOtp[index] = char;
    });

    setOtp(newOtp);
    onChange(newOtp.join(""));

    // Focus next empty input or last input
    const nextEmptyIndex = newOtp.findIndex((val) => !val);
    const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className={`flex gap-2 justify-center ${className}`}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-12 h-14 text-center text-xl font-semibold border-2 border-border rounded-lg 
                     bg-background text-foreground
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                     transition-all duration-200 ease-in-out
                     hover:border-primary/50"
        />
      ))}
    </div>
  );
};

export default OTPInput;
