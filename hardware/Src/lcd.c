/**     
******************************************************************************
 @brief   Collection of Display-related functions
 @file    lcd.c 
 @author  Mahad Hassan
@date    24-February-2018
 ****************************************************************************** 
*/

#include <stdint.h>
#include <string.h>
#include "main.h"
#include "callback.h"
#include "stm32f3xx_hal_uart.h"
#include "clockx.h"
#include "adcx.h"

/** variables for time*/
RTC_TimeTypeDef sTime1;
/** variable for date*/
RTC_DateTypeDef sDate1;
/** array for HH:MM:SS*/
uint8_t buffer[8];

/** 
 @brief Writes a char value through SPI to EA DOGS Display. 
 @param int inp, char ins
 decides if the second @param ins is data to be seen in the display
 or if it's a setting that changes the attributes of the display.
*/
void lcdwrite(int inp,char ins) 
{  
  uint8_t var;  //Decides if written instruction is data or setting
  
  uint8_t arglo = ins & 0x0F;   //lower data bits
  uint8_t arghi = (ins >> 4) & 0x0F;    //higher data bits
  if(inp == 0)
    var = 0x1F; //setting
  else
    var = 0x5F; //data
  
  char buf[] = {var, arglo, arghi};     //send the 24 bit data buffer
  
  HAL_SPI_Transmit_IT(&hspi2, (uint8_t *)buf, 3);       //transmit through SPI

  while(SPIReady != SET)
  {
  }
  
  SPIReady = RESET;
}

/** @brief initialises the EA DOGS Display 
    @param None
    @retval None
*/
void initDispl()
{
  uint8_t funct_set = 0x3A;	//8-Bit data length extension Bit RE=1; REV=0
  uint8_t clr_disp = 0x01;
  uint8_t ex_funct_set = 0x09;	//4 line display
  uint8_t ent_mod_set = 0x06;	//Bottom view
  uint8_t bi_set = 0x1E;  //Bias setting BS1=1
  uint8_t funct_set2 = 0x39;      //8-Bit data length extension Bit RE=0; IS=1
  uint8_t int_osc = 0x1B;      //BS0=1 -> Bias=1/6
  uint8_t fol_con = 0x6E; //Divider on and set value
  uint8_t pow_cont = 0x56; //Booster on and set contrast (BB1=C5, DB0=C4)
  uint8_t set_con = 0x7A;        //Set contrast (DB3-DB0=C3-C0)
  uint8_t funct_set3 = 0x38;     //8-Bit data length extension Bit RE=0; IS=0
  uint8_t disp_on = 0x0f;
  
  /* writes the settings to the Display   */
  lcdwrite(0,funct_set);
  lcdwrite(0,clr_disp);
  lcdwrite(0,ex_funct_set);
  lcdwrite(0,ent_mod_set);
  lcdwrite(0,bi_set);
  lcdwrite(0,funct_set2);
  lcdwrite(0,int_osc);
  lcdwrite(0,fol_con);
  lcdwrite(0,pow_cont);
  lcdwrite(0,set_con);
  lcdwrite(0,funct_set3);
  lcdwrite(0,disp_on);
}

/**
 @brief Sets the row that the LCD Display will write on
 first row: 0x00
 second row: 0x20
 third row: 0x40
 fourth row: 0x60
 @param char pos
 @retval None
*/
void lcdsetpos(char pos)
{
 lcdwrite(0,0x80 + pos);
}

/**
  @brief Clears everything in the EA DOGS Display 
  @param None
  @retval None
*/
void lcdclr(void)
{
  lcdwrite(0, 0x01);
}

/**  
 @brief Writes a string into EA DOGS Display and sets the row that the
 string will be written into
 @param char* vec, char pos
 @retval None
*/
void lcdwritestring(char* vec, char pos)
{
  lcdsetpos(pos);       //Sets the row
  int len = strlen(vec);        //length of the string
  for(int i = 0; i < len; i++)
   {
    lcdwrite(1, vec[i]);        //writes the string one char at a time
   }
}

/**
 @brief The main task program that shows the RTC clock and ADV voltage   
 @param None
 @retval None
 */
void showTask(void)
{
  initDispl();  //Initialise the display
  lcdclr();     //Clear the display
  settime();    //Set the time
  
  uint32_t res1; //variable for ADC value
  uint8_t b[6]; //buffer for ADC
  
  /* Infinite loop */
  while (1)
  {
    HAL_ADC_Start_IT(&hadc1);   //Start the ADC using interrupt
    
    if(HAL_ADC_Start_IT(&hadc1)!= HAL_OK)
    {   
      Error_Handler(); 
    }
    
    while (ADCReady != SET)
    {
    }
    
    ADCReady = RESET;
    
    res1 = HAL_ADC_GetValue(&hadc1);    //Takes the value of the ADC 0 - 4095
    buildADC(res1, b);                  //Turn binary value into voltage, builds string
   
    lcdwritestring((char*) b, 0x60);    //Write the voltage to the Display
    
    HAL_RTC_GetTime(&hrtc, &sTime1, RTC_FORMAT_BCD);    //Get the time
    HAL_RTC_GetDate(&hrtc, &sDate1, RTC_FORMAT_BCD);    //Get the date
    
    buildRTC(buffer);                   //Turn time into readable string
    lcdwritestring((char*)buffer, 0x00);        //Write the time to the Display
    
    HAL_ADC_Stop_IT(&hadc1);            //Stop the display
  }
}