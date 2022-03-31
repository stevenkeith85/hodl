export const HodlVideo = ({cid, directory='nfts', gif=false, controls=true, onlyPoster=false}) => {
    const asset = `https://res.cloudinary.com/dyobirj7r/${directory}/${cid}`;
    return (
        <video width="100%" autoPlay={gif} loop={gif} muted={gif} controls={!gif && controls} controlsList="nodownload" poster={`${asset}.jpg`}>
            { Boolean(!onlyPoster) && (<>
                <source type="video/mp4" src={`${asset}.mp4`} />
                <source type="video/webm" src={`${asset}.webm`}  />
                Your browser does not support HTML5 video tag. 
                { gif && <a href={`${asset}.gif`} >Click here to view original GIF</a> }
            </>)}
        </video>
    )
}