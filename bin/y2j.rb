require 'pathname'
require 'yaml'
require 'oj'
file = (Pathname(__FILE__).dirname / "../data/tweets").to_s
File.write("#{file}.json", Oj.dump(YAML.load_file("#{file}.yaml")))
