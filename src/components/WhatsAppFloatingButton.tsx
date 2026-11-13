const WhatsAppFloatingButton = () => {
  const handleClick = () => {
    const message = encodeURIComponent(
      "¡Hola FerreEcoTools! Estoy interesado en sus productos y quisiera más información."
    );
    const phoneNumber = "573137906406";
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-[transform,background-color,box-shadow] duration-300 hover:scale-110 hover:bg-[#20BA5A] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 md:h-16 md:w-16"
    >
      <svg
        viewBox="0 0 32 32"
        fill="white"
        className="h-8 w-8 md:h-9 md:w-9"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.128-1.958A15.907 15.907 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.314 22.588c-.392 1.104-1.938 2.02-3.196 2.288-.86.182-1.982.328-5.762-1.238-4.834-2.004-7.944-6.908-8.184-7.228-.23-.32-1.938-2.58-1.938-4.92s1.226-3.488 1.662-3.968c.392-.432 1.038-.648 1.656-.648.2 0 .38.01.54.018.476.02.714.048 1.028.796.392.932 1.346 3.272 1.462 3.512.118.24.236.56.076.88-.15.33-.282.476-.522.756-.24.28-.468.494-.708.794-.22.26-.468.538-.19 1.012.278.466 1.236 2.038 2.654 3.3 1.824 1.624 3.316 2.142 3.868 2.372.392.164.86.124 1.148-.18.366-.388.818-1.03 1.278-1.662.328-.452.74-.508 1.172-.348.438.15 2.77 1.306 3.246 1.544.476.24.792.356.91.556.116.2.116 1.144-.276 2.248z" />
      </svg>
    </button>
  );
};

export default WhatsAppFloatingButton;
