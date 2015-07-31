require 'pathname'
require 'oj'
tweets = Oj.load_file((Pathname(__FILE__).dirname / "../data/tweets.json").to_s)
get '/' do
  tweet = tweets.sample
  slim :index, locals: {
    tweet: tweet
  }
end
