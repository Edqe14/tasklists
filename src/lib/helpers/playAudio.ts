const playAudio = (src: string) => {
  const audio = new Audio(src);
  audio.volume = 0.5;
  audio.play();

  return audio;
};

export default playAudio;