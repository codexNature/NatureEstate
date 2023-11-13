import React from 'react'
import photo15 from '../assets/photos/Photo015.jpg'

export default function About() {
  return (
    <div className="py-20 px-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-slate-800">
        About Nature Estates
      </h1>
      <p className="mb-4 text-slate-700">
        <span className='font-semibold' >Nature Estate</span> dolor sit amet, consectetur adipiscing elit,
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Vulputate mi sit amet mauris commodo quis imperdiet massa. Eget dolor
        morbi non arcu risus quis. Nunc vel risus commodo viverra maecenas
        accumsan. Cras ornare arcu dui vivamus arcu felis bibendum ut tristique.
        Ultrices tincidunt arcu non sodales neque sodales ut. Velit ut tortor
        pretium viverra suspendisse potenti nullam ac tortor. Tempor id eu nisl
        nunc mi ipsum faucibus vitae aliquet. Ipsum dolor sit amet
      </p>

      <p className="mb-4 text-slate-700">
        <span className="font-semibold">Our Mission</span> consectetur. Arcu
        cursus vitae congue mauris rhoncus aenean. At elementum eu facilisis sed
        odio morbi quis commodo odio. Massa tincidunt dui ut ornare lectus sit.
        Mauris ultrices eros in cursus. Ac feugiat sed lectus vestibulum mattis.
        Fusce id velit ut tortor pretium. In dictum non consectetur a erat nam.
        Bibendum est ultricies integer quis auctor elit sed vulputate mi. Augue
        mauris augue neque gravida in fermentum et.
      </p>

      <p className="mb-4 text-slate-700">
        <span className="font-semibold">Our Team</span> Hac habitasse platea
        dictumst quisque. Consectetur libero id faucibus nisl tincidunt eget
        nullam non nisi. Pretium fusce id velit ut tortor pretium. Nisi est sit
        amet facilisis magna etiam tempor. Eget nulla facilisi etiam dignissim
        diam quis enim lobortis scelerisque. Nec nam aliquam sem et tortor
        consequat id porta. Diam vulputate ut pharetra sit amet. Semper eget
        duis at tellus at urna condimentum mattis
      </p>
      <div className="flex gap-6 items-center place-content-center">
        <p className="place-content-center">
          <img className="h-[220px] rounded-full" src={photo15} alt="Sola" />
          <h2>Sola Jaiyeola</h2>
        </p>
        <p>
          <img className="h-[220px] rounded-full" src={photo15} alt="Sola" />
          <h2>Sola Jaiyeola</h2>
        </p>
        <p>
          <img className="h-[220px] rounded-full" src={photo15} alt="Sola" />
          <h2>Sola Jaiyeola</h2>
        </p>
      </div>
    </div>
  );
}

