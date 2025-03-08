export default function MorphMarker({
    isDot,
    className,
}: {
    isDot: boolean;
    className: string;
}) {
    // The two paths should have the same structure and should thus be morphable
    const circle =
        'M12 2C8.13 2 5 5.13 5 9c0 3.87 3.13 7 7 7s7-3.13 7-7c0-3.87-3.13-7-7-7m0 4.99c0.01 0 0.01 0.01 0.01 0.01s-0.01 0.01-0.01 0.01-0.01-0.01-0.01-0.01 0.01-0.01 0.01-0.01';
    const locationPin =
        'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7m0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5';
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d={isDot ? circle : locationPin}></path>
        </svg>
    );
}
