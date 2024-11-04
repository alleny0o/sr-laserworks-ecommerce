import { Card, Flex, Text, Stack } from '@sanity/ui'
import Image from 'next/image';

interface MediaPreviewProps {
  value: {
    mediaType: 'image' | 'video'
    media?: {
      asset: {
        url: string
      }
    }
    video?: {
      asset: {
        url: string
      }
    }
    alt: string
  }
}

export const MediaPreview = ({value}: MediaPreviewProps) => {
  const {mediaType, media, video, alt} = value
  
  return (
    <Card padding={2} radius={2} shadow={1}>
      <Stack space={2}>
        <Flex justify="center" align="center" style={{minHeight: '100px'}}>
          {mediaType === 'video' && video ? (
            <video
              src={video.asset.url}
              style={{maxWidth: '100%', maxHeight: '100px'}}
              controls
              muted
            />
          ) : (
            media && (
              <Image
                src={media.asset.url}
                alt={alt}
                layout="responsive"
                width={100}
                height={100}
              />
            )
          )}
        </Flex>
        <Text size={1} align="center">
          {mediaType === 'video' ? '🎥' : '📸'} {alt}
        </Text>
      </Stack>
    </Card>
  )
}