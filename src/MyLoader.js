import React from "react"
import ContentLoader from "react-content-loader"

const MyLoader = (props) => (
  <ContentLoader 
    speed={2}
    width={360}
    height={900}
    viewBox="0 0 360 900"
    backgroundColor="#f3f3f3"
    foregroundColor="#d6d6d6"
    {...props}
  >
    <rect x="0" y="10" rx="0" ry="0" width="139" height="156" /> 
    <rect x="5" y="204" rx="0" ry="0" width="163" height="43" /> 
    <rect x="5" y="264" rx="0" ry="0" width="131" height="25" /> 
    <rect x="229" y="419" rx="0" ry="0" width="21" height="0" /> 
    <rect x="5" y="316" rx="0" ry="0" width="320" height="84" /> 
    <rect x="5" y="450" rx="0" ry="0" width="310" height="39" /> 
    <rect x="5" y="510" rx="0" ry="0" width="310" height="39" /> 
    <rect x="5" y="570" rx="0" ry="0" width="310" height="39" /> 
    <rect x="5" y="630" rx="0" ry="0" width="310" height="39" /> 
    <rect x="5" y="690" rx="0" ry="0" width="310" height="39" />
  </ContentLoader>
)

export default MyLoader

