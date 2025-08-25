import React from 'react';
export function Gallery() {
  // Using the provided images and placeholder images
  const galleryImages = [
    "/placeholder-1.png",
    "/placeholder-2.png", 
    "/placeholder-3.png",
    "/placeholder-4.png",
    "/placeholder-5.png",
    "/placeholder-6.png"
  ];
  return <section id="gallery" className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-2">Nossa Galeria</h2>
        <p className="text-center text-gray-600 mb-12">
          Alguns dos trabalhos realizados em nossa barbearia
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => <div key={`gallery-${image}-${index}`} className="overflow-hidden rounded-lg h-64">
              <img src={image} alt={`Trabalho ${index + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>)}
        </div>
      </div>
    </section>;
}