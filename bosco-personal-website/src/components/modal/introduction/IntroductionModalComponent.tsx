// util
import { useContext } from "react"
import { modalStyles } from "../util"
import { MapperContext } from "../../../globalVariable/MapperContextProvider"
import { translationKeys } from "../../../globalVariable/Translation"

export default function IntroductionModalComponent() {
  // style variable
  const headlineStyle = 'text-center font-medium text-[#0B1A33] dark:text-white text-[20px] sm:text-[20px] md:text-[20px] lg:text-[25px]'
  const textStyle = 'mt-[0.5rem] text-justify text-[14px] sm:text-[14px] md:text-[14px] lg:text-[16px] text-[#9A9A9A] dark:text-[#94A3B8]'
  // translation
  const { t } = useContext(MapperContext)

  return (
    <div className={modalStyles.modalMainDiv}>
      {/* headline */}
      <span className={headlineStyle}>
        {t(translationKeys.introModalTitle)}
      </span>
      {/* description */}
      <span className={textStyle}>
        {t(translationKeys.introModalDescription)}
      </span>
    </div>
  )
}
