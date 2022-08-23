import { KeyboardArrowRight } from "@mui/icons-material"
import { MobileStepper, Button } from "@mui/material"

export const MintMobileStepper = ({ activeStep, stepLabels, stepComplete, setActiveStep }) => {
    return (
        <MobileStepper
            variant="text"
            steps={4}
            position="static"
            activeStep={activeStep}
            sx={{
                width: '100%',
                paddingY: 2,
                // background: '#f9f9f9',
                borderRadius: 1,
                '&:before': {
                    content: `"${stepLabels[activeStep]}"`,
                    fontWeight: 900
                }
            }}
            backButton={''}
            nextButton={
                <Button
                    endIcon={<KeyboardArrowRight />}
                    disabled={stepComplete < activeStep}
                    variant="outlined"
                    onClick={() => {
                        console.log(stepComplete, activeStep)
                        stepComplete === activeStep && setActiveStep(activeStep => activeStep + 1)}}>
                        Next
                </Button>
            }
        />)
}