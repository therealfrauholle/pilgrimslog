export default function Title() {
    return (
        <div
            className="flex flex-col items-center top-0 h-full text-center px-4"
        >
            <div className="tracking-tighter mx-auto text-center transition-colors py-4">
                <h1 className="text-4xl md:text-6xl sm:text-4xl font-extrabold mb-2 text-extra">
                    Logbuch
                </h1>
                <h2 className="text-2xl md:text-4xl sm:text-xl pl-4">eines Pilgers</h2>
            </div>
            <div className="flex prose prose-blog overflow-y-auto px-4 md:px-6 pb-4 text-sm text-left tracking-wide md:text-xl leading-6 md:leading-8" >
                Wir sind alle Pilger im Leben: Einen Tag kommen wir, den
                anderen gehen wir. Nur auf der Durchreise.
                <br />
                Dieses Logbuch eines Pilgers sucht festzuhalten, was nicht
                greifbar scheint. Alles andere mag zwischen den Seiten
                verloren gehen.
                <br />
                Kannst du es begreifen?
            </div>
        </div>
    );
}
