const RamadanCountdown = () => {
    const [timeLeft, setTimeLeft] = React.useState({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    });
    const [isRamadan, setIsRamadan] = React.useState(false);
  
    React.useEffect(() => {
      const ramadanDate = new Date('2025-03-01T00:00:00');
  
      const timer = setInterval(() => {
        const now = new Date();
        const difference = ramadanDate.getTime() - now.getTime();
  
        if (difference > 0) {
          setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
          });
        } else {
          setIsRamadan(true);
          clearInterval(timer);
        }
      }, 1000);
  
      return () => clearInterval(timer);
    }, []);
  
    return (
      <div className="w-50 rounded-lg p-4 shadow-lg relative" 
           style={{
             backgroundImage: 'url("background.png")',
             backgroundSize: 'cover',
             backgroundPosition: 'center'
           }}>
        <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-4">
            {isRamadan ? (
              <h2 className="text-xl font-bold text-white animate-wave">
                <i className="fas fa-moon text-yellow-400"></i>
                نهنئكم بحلول الشهر الفضيل
                <i className="fas fa-moon text-yellow-400"></i>
              </h2> 
            ) : (
              <h2 className="text-xl font-bold text-white animate-wave">
                <i className="fas fa-moon text-yellow-400"></i>
                رمضان كـــريم
                <i className="fas fa-moon text-yellow-400"></i>
              </h2>
            )}
          </div>
          
          <div className="grid grid-cols-4 gap-1">
            <div className="bg-black bg-opacity-60 p-2 rounded order-4 flex flex-col items-center justify-center min-h-[2rem]">
              <div className="text-lg font-bold text-white text-center">{timeLeft.days}</div>
              <div className="text-xs text-yellow-300 text-center">يوم</div>
            </div>
            <div className="bg-black bg-opacity-60 p-2 rounded order-3 flex flex-col items-center justify-center min-h-[2rem]">
              <div className="text-lg font-bold text-white text-center">{timeLeft.hours}</div>
              <div className="text-xs text-yellow-300 text-center">ساعة</div>
            </div>
            <div className="bg-black bg-opacity-60 p-2 rounded order-2 flex flex-col items-center justify-center min-h-[2rem]">
              <div className="text-lg font-bold text-white text-center">{timeLeft.minutes}</div>
              <div className="text-xs text-yellow-300 text-center">دقيقة</div>
            </div>
            <div className="bg-black bg-opacity-60 p-2 rounded order-1 flex flex-col items-center justify-center min-h-[2rem]">
              <div className="text-lg font-bold text-white text-center">{timeLeft.seconds}</div>
              <div className="text-xs text-yellow-300 text-center">ثانية</div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  
