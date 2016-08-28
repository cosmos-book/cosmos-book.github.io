# Data source

The data are from the ["X-ray Flare" dataset](http://www.ngdc.noaa.gov/stp/space-weather/solar-data/solar-features/solar-flares/x-rays/goes/xrs/) prepared by and made available through the NOAA National Geophysical Data Center (NGDC)


## Notes

The [format](http://www.ngdc.noaa.gov/stp/space-weather/solar-data/solar-features/solar-flares/x-rays/documentation/miscellaneous/xray.fmt.rev) is as follows:

----------------------------------------------------------------------
  Column  Fmt   Description
 ----------------------------------------------------------------------
   1- 2   I2    Data code; always 31.
   3- 5   I3    Station code, 777 for GOES
   6- 7   I2    Year
   8- 9   I2    Month
  10-11   I2    Day
  12-13   A2    Asterisks mark record with unconfirmed change.
  14-17   I4    Start time.
                NOTE: If event is correlated to an optical
                flare in data prior to 1997, the event times
                are for the optical event.  For data after 1996,
                these event times WILL BE FOR THE XRAY EVENT ONLY.
     18   1X    
  19-22   I4    End time. 
     23   1X    
  24-27   I4    Max time.
     28   1X    
     29   A1    N or S for north or south latitude of correlated
                optical flare, if known.
  30-31   I2    Latitude of correlated optical flare, if known.
     32   A1    E or W for east or west central meridian distance
                of correlated optical flare, if known.
  33-34   I2    Central meridian distance of correlated optical
                flare, if known.
     35   A1    Optical importance based on flare area = S,1,2 or 3.
     36   A1    Optical brightness: F=faint, N=normal, B=bright.
  37-59  33X   
     60   A1    X-ray class: C,M,X code the maximum power of 10
                   the 1-8 Angstrom flux attains.*
  61-63   F3.1  X-ray intensity: a number from 1.0 to 9.9 that
                   multiplies the X-ray class.
  64-67   I4    Calcium plage region in which flare occurred.
  68-71   A4    Station name abbreviation - GOES.
     72   1X   
  73-80   A8    Remarks: Beginning with January 1997 data,
                the integrated flux from event start to end
                will appear here if available (units = J/m*2).
  81-85   I5    NOAA/USAF sunspot region number.
     86   A1    Blank; may be used to add a letter to a region.
  87-88   I2    Central meridian passage year.
  89-90   I2    Central meridian passage month.
  91-94   F4.1  Central meridian passage day.
  95-100  A6    Blank
-----------------------------------------------------------------------
 *  X-ray classes are classified according to the order of magnitude
of the peak burst intensity (I) measured at the Earth by satellites
in the 0.1 to 0.8 nm band as follows:

        Class              W/m*2                 Ergs/cm*2/s
          B                  I < 10E-6                I < 10E-3
          C         10E-6 <= I < 10E-5       10E-3 <= I < 10E-2
          M         10E-5 <= I < 10E-4       10E-2 <= I < 10E-1
          X                  I >=10E-4                I >=10E-1
