package edu.gatech.cse6242;

import org.apache.hadoop.fs.Path;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.util.*;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

import java.io.IOException;
import java.util.StringTokenizer;

public class Q1 {
  public class DblArrayWritable extends ArrayWritable { 
    public DblArrayWritable(){ 
      super(DoubleWritable.class); 
    }
  }

  public static class TokenizerMapper extends Mapper<Object, Text, IntWritable, Text>{

    private final static IntWritable one = new IntWritable(1);
    private IntWritable src = new IntWritable();
    // private Text tgt = new Text();
    // private Text weight = new Text();
    private Text tgt_weight = new Text();

    public void map(Object key, Text value, Context context) throws IOException, InterruptedException {
      StringTokenizer itr = new StringTokenizer(value.toString(), "\t");
      while (itr.hasMoreTokens()) {
        src.set(Integer.parseInt(itr.nextToken()));
        // tgt.set(itr.nextToken());
        // weight.set(Integer.parseInt(itr.nextToken()));
        String tgt = itr.nextToken();
        String weight = itr.nextToken();
        tgt_weight.set(tgt+","+weight);
        if(tgt.length()>0){
          context.write(src, tgt_weight);
        }
        
      }
    }
  }

  public static class IntSumReducer extends Reducer<IntWritable,Text,IntWritable,Text> {
    private Text result = new Text();

    public void reduce(IntWritable key, Iterable<Text> values,
                       Context context
                       ) throws IOException, InterruptedException {
      int max = 0;
      int target = 0;
      for (Text val : values) {
      	StringTokenizer itr = new StringTokenizer(val.toString(), ",");
      	String tgt="", weight="";
      	int tgt_val=0, weight_val=0;
      	while (itr.hasMoreTokens()) {
      	  tgt = itr.nextToken();
      	  tgt_val =Integer.parseInt(tgt);
      	  weight = itr.nextToken();
      	  weight_val = Integer.parseInt(weight);
      	}
        if (weight_val == max && tgt_val<target){
          max = weight_val;
          target = tgt_val;
        }
        if (weight_val > max){
          max = weight_val;
          target = tgt_val;
        }
      }
      result.set(String.valueOf(max)+","+String.valueOf(target));
      if(max>0) {
      	context.write(key, result);
      }
    }
  }

  public static void main(String[] args) throws Exception {
    Configuration conf = new Configuration();
    Job job = Job.getInstance(conf, "Q1");
    job.setJarByClass(Q1.class);
    job.setMapperClass(TokenizerMapper.class);
    job.setCombinerClass(IntSumReducer.class);
    job.setReducerClass(IntSumReducer.class);
    job.setOutputKeyClass(IntWritable.class);
    job.setOutputValueClass(Text.class);
    FileInputFormat.addInputPath(job, new Path(args[0]));
    FileOutputFormat.setOutputPath(job, new Path(args[1]));
    System.exit(job.waitForCompletion(true) ? 0 : 1);
  }
}
