// We use this to generate all cloudinary urls, to ensure they are always generated the same
export interface TransformParams {
    aspect_ratio?: string, // pass in a value like '1:1', '4:5', etc
    crop?: string, // pass in a value like 'crop', 'limit', etc,
    duration?: number, // pass in the duration in seconds of a video or audio clip
    effect?: 'improve' | 'grayscale' | 'athena' | 'aurora' | 'hairspray',
    height?: string, // pass in integers like '150' or 'ih' for original height
    quality?: string, // pass in an integer like 70 or 'auto'. we set it to auto at upload; so doubt we really need this
    round?: string, // pass in 'max' to get a circle (also set aspect ratio to 1:1) or oval
    width?: string, // pass in integers like '150' or 'iw' for original width
};

export const makeCloudinaryUrl = (
    asset_type: "image" | "video",
    folder: "uploads" | "nfts",
    content_id: string,
    {
        aspect_ratio,
        crop,
        duration,
        effect,
        height,
        quality,
        round,
        width
    }: TransformParams,
    extension?: string
) => {

    const delivery_type = 'upload';
    const cloud_name = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
    const environment = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER;

    // we always append transformations in the same order to prevent us generating multiple derived assets that look the same
    // and wasting our quota
    const transformationCollection = [];

    if (aspect_ratio) {
        transformationCollection.push(`ar_${aspect_ratio}`);
    }

    if (crop) {
        transformationCollection.push(`c_${crop}`);
    }

    if (duration && asset_type === "video") {
        transformationCollection.push(`du_${duration}`);
    }

    if (effect) {
        if (effect === 'improve' || effect === 'grayscale') {
            transformationCollection.push(`e_${effect}`)
        } else {
            transformationCollection.push(`e_art:${effect}`)
        }
    }

    if (height) {
        transformationCollection.push(`h_${height}`);
    }

    if (quality) {
        transformationCollection.push(`q_${quality}`);
    }

    if (round) {
        transformationCollection.push(`r_${round}`);
    }

    if (width) {
        transformationCollection.push(`w_${width}`);
    }

    if (transformationCollection.length) {
        const transformations = transformationCollection.join(',');
        return `https://res.cloudinary.com/${cloud_name}/${asset_type}/${delivery_type}/${transformations}/${environment}/${folder}/${content_id}${extension ? '.' + extension : ''}`;
    }

    return `https://res.cloudinary.com/${cloud_name}/${asset_type}/${delivery_type}/${environment}/${folder}/${content_id}${extension ? '.' + extension : ''}`;
}