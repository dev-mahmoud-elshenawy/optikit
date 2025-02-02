class OptiKit < Formula
    desc "Optikit CLI Tool"
    homepage "https://github.com/dev-mahmoud-elshenawy/optikit"
    url "https://github.com/dev-mahmoud-elshenawy/optikit/archive/v1.1.0.tar.gz"
    sha256 "0228171a2d009bfdef9ad2caaed942f9d3dafbdc5977e813080c65eb12898b6c"
    license "ISC"
  
    depends_on "node"
  
    def install
      system "npm", "install", "--prefix", buildpath
  
      bin.install "dist/cli.js" => "optikit"
    end
  
    test do
      system "#{bin}/optikit", "--version"
    end
  end