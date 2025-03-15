export default function Title() {
    return (
        <div
            className="flex flex-col items-center justify-center h-full text-center px-6"
            style={{ padding: '30px' }}
        >
            <div className="tracking-tight max-w-lg mx-auto text-center transition-colors">
                <h2 className="text-6xl font-extrabold mb-6 text-extra">
                    Logbuch
                </h2>
                <div className="text-2xl pl-4 text-nornal">eines Pilgers</div>
            </div>
            <div style={{ padding: '30px' }}>
                <p className="text-md md:text-xl text-normal">
                    Wir sind alle Pilger im Leben: Einen Tag kommen wir, den
                    anderen gehen wir. Nur auf der Durchreise.
                    <br />
                    Dieses Logbuch eines Pilgers sucht festzuhalten, was nicht
                    greifbar scheint. Alles andere mag zwischen den Seiten
                    verloren gehen.
                    <br />
                    Kannst du es begreifen?
                </p>
            </div>
        </div>
    );
}
