import { useCallback, useEffect, useRef } from 'react'

interface UseInfiniteScrollProps {
  status: 'LoadingFirstPage' | 'CanLoadMore' | 'LoadingMore' | 'Exhausted'
  loadMore: (numItems: number) => void
  loadSize?: number
  observerEnabled?: boolean
}

export const userInfiniteScroll = ({
  status,
  loadMore,
  loadSize = 10,
  observerEnabled = true,
}: UseInfiniteScrollProps) => {
  const topElementRef = useRef<HTMLDivElement>(null)

  const loadMoreItems = useCallback(() => {
    if (status === 'CanLoadMore') {
      loadMore(loadSize)
    }
  }, [status, loadMore, loadSize])

  useEffect(() => {
    const topElement = topElementRef.current
    if (!(topElement && observerEnabled)) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadMoreItems()
          }
        })
      },
      {
        threshold: 0.1,
      }
    )

    observer.observe(topElement)

    return () => {
      observer.disconnect()
    }
  }, [observerEnabled, loadMoreItems])

  return {
    topElementRef,
    handleLoadMore: loadMoreItems,
    canLoadMore: status === 'CanLoadMore',
    isLoadingMore: status === 'LoadingMore',
    isLoadingFirstPage: status === 'LoadingFirstPage',
    isExhausted: status === 'Exhausted',
  }
}
