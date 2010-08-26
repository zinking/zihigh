# coding=utf-8
import re;





s = """
attach('1.jpg', 121003, 247);attach('jia.jpg', 60884, 121268);attach('佳2.jpg', 76063, 182172);attach('559689820070514221651062_9_640.jpg', 239662, 258255);attach('_MG_4338副本.jpg', 373973, 497964);attach('77.jpg', 305928, 871966);attach('IMG_0690-1.jpg', 100589, 1177913);attach('DSC_0048.jpg', 188655, 1278529);o.h(0);o.t();';
"""
p = "attach\('.*?', .*?, (.*?)\);";
mm  =  re.finditer( p, s);
ll = [0,];
for m in mm:
    print m.group( *ll );

