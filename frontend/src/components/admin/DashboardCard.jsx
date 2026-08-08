const DashboardCard = ({

    title,

    value,

    color

}) => {

    return (

        <div

            className={`rounded-xl p-6 shadow text-white ${color}`}

        >

            <h3 className="text-lg">

                {title}

            </h3>

            <h2 className="text-4xl font-bold mt-3">

                {value}

            </h2>

        </div>

    );

};

export default DashboardCard;