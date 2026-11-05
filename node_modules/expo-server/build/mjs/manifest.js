export function normalizeCssAssets(assets) {
    const css = (assets?.css ?? []).map((entry)=>typeof entry === 'string' ? {
            type: 'css',
            href: entry
        } : entry);
    // NOTE(@hassankhan): We still need to support SDK 55-57 deployments
    const externalCss = (assets?.externalCss ?? []).map(({ href, media })=>({
            type: 'external',
            href,
            media
        }));
    return [
        ...css,
        ...externalCss
    ];
}

//# sourceMappingURL=manifest.js.map
