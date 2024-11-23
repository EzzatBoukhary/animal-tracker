// Give it the post posted date and it returns 5m ago, 5h ago, 5d ago...
export const formatPostedDate = (dateString: string): string => {
    const postedDate = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - postedDate.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)
  
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      return `${diffInDays}d ago`
    }
  }