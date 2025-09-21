import { screen, render } from '@testing-library/react';
import Video, { VideoProps } from '../../components/video';
import withVideo from './with-video';
import { faker } from '@faker-js/faker';

vi.mock('../../components/video', async () => {
  const originalModule = await vi.importActual('../../components/video');

  return {
    ...originalModule,
    default: vi.fn(() => null)
  };
});

describe('HOC: withVideo', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should render correctly with HOC', () => {
    const expectedText = 'Hello world!';
    const MockComponent = () => <span>{expectedText}</span>;
    const WrappedComponent = withVideo(MockComponent);

    render(<WrappedComponent />);

    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });

  it.each([
    {
      src: faker.internet.url(),
      isPlaying: true,
      muted: true,
      loop: true
    },
    {
      src: faker.internet.url(),
      startTime: 1234,
      isPlaying: false,
      onLoadedMetadata: vi.fn(),
      onTimeUpdate: vi.fn(),
      onEnded: vi.fn(),
      onPlaybackError: vi.fn(),
    }
  ])('should call video component correctly via render prop', (videoProps) => {
    type MockComponentProps = {
      renderVideo: (options: VideoProps) => JSX.Element;
    }
    const MockComponent = ({ renderVideo }: MockComponentProps) => (
      <>{renderVideo(videoProps)}</>
    );
    const WrappedComponent = withVideo(MockComponent);

    render(<WrappedComponent />);

    expect(Video).toHaveBeenCalledOnce();
    expect(Video).toHaveBeenCalledWith(videoProps, expect.anything());
  });
});
