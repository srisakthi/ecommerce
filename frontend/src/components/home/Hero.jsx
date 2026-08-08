const Hero = () => {

    return (

        <section className="relative">

            <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600"
                alt="Hero Banner"
                className="w-full h-[500px] object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />

        </section>

    );

};

export default Hero;