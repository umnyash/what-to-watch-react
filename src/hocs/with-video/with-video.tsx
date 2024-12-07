import { ComponentType } from 'react';
import Video, { VideoProps } from '../../components/video';

type HOCProps = {
  renderVideo: (options: VideoProps) => void;
}

function withVideo<T>(Component: ComponentType<T>)
  : ComponentType<Omit<T, keyof HOCProps>> {

  type ComponentProps = Omit<T, keyof HOCProps>;

  function WithVideo(props: ComponentProps): JSX.Element {
    return (
      <Component
        {...props as T}
        renderVideo={(options: VideoProps) => (
          <Video {...options} />
        )}
      />
    );
  }

  return WithVideo;
}

export default withVideo;
