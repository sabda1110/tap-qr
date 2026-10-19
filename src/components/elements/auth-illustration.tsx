type AuthIllustrationProps = {
  src: string;
};

export function AuthIllustration({ src }: AuthIllustrationProps) {
  return (
    <img
      className="h-auto w-full select-none"
      src={src}
      alt=""
      width={1448}
      height={1086}
      decoding="async"
      draggable={false}
    />
  );
}
