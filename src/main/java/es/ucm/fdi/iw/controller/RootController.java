package es.ucm.fdi.iw.controller;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.List;

import javax.persistence.EntityManager;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import es.ucm.fdi.iw.LocalData;
import es.ucm.fdi.iw.model.Code;
import es.ucm.fdi.iw.model.Map;
import es.ucm.fdi.iw.model.User;

@Controller	
public class RootController{

	private static Logger log = Logger.getLogger(RootController.class);
	
	@Autowired
	private LocalData localData;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private EntityManager entityManager;
	
    @ModelAttribute
    public void addAttributes(Model model) {
        model.addAttribute("s", "/static");
    }
    
    @RequestMapping(value = "/createUser", method = RequestMethod.POST)
	@Transactional
	public String createUser(
			@RequestParam String nickname, 
			@RequestParam String password,
			@RequestParam String confirmPassword, HttpSession s) {
		User u = new User();
		u.setNickname(nickname);
		u.setPassword(passwordEncoder.encode(password));
		u.setWin(0);
		u.setDraw(0);
		u.setLose(0);
		u.setEnabled((byte) 0x01);
		u.setRoles("USER");
		entityManager.persist(u);
		
		entityManager.flush();
		
		
		return "login";
	}
    
    @RequestMapping(value = "/createCode", method=RequestMethod.POST)
    @Transactional
    public String handleFileUpload(
    		HttpServletResponse response,
    		@RequestParam("code") String code,
    		@RequestParam("codeFileName") String codeFileName,
    		HttpSession s,
    		Model m){
    	response.setHeader("X-XSS-Protection", "0");
    	
		String error = "";
        if (code.isEmpty()) {
        	error = "You failed to upload a photo for " 
                + codeFileName + " because the file was empty.";     
        	log.info(error);
        } else {
        	
	    		Code codeObject= new Code();
	    		User u = new User();
	    		u.setId(Long.parseLong(s.getAttribute("user").toString()));
	    		codeObject.setCreator(u);
	    		codeObject.setDescription("");
	    		codeObject.setName(codeFileName);
	    		codeObject.setCreationTime(Calendar.getInstance().getTime());

	    		entityManager.persist(codeObject);
	    		
	    		entityManager.flush();
	    		
	    		File f = localData.getFile("codes", String.valueOf(codeObject.getId()));
	    		try (BufferedOutputStream stream =
		                new BufferedOutputStream(
		                		new FileOutputStream(f)
		                )
		        )
	    		{
	    			stream.write(code.getBytes());
	     
	    		} catch (Exception e) {
	    			error = "Upload failed " + codeFileName + " => " + e.getMessage();
	    		}
	  
	            return "/code-design";
	            
        }
        // exit with error, blame user
    	response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        return error;
	}
    
    @RequestMapping(value="/createMap", method=RequestMethod.POST)
    @Transactional
    public String handleFileUpload(
    		HttpServletResponse response,
    		@RequestParam String json,
    		@RequestParam String mapFileName,
    		HttpSession s){

    	String error = "";
        if (json.isEmpty()) {
        	
        	error = "You failed to upload the map";     
        	log.info(error);
        } else {
        	
	    		Map map= new Map();
	    		User u = new User();
	    		u.setId(Long.parseLong(s.getAttribute("user").toString()));
	    		map.setCreator(u);
	    		map.setDescription("");
	    		map.setName(mapFileName);
	    	
	    		map.setCreationTime(Calendar.getInstance().getTime());

	    		entityManager.persist(map);
	    		
	    		entityManager.flush();
	    		
	    		File f = localData.getFile("maps", String.valueOf(map.getId()));
	    		try (BufferedOutputStream stream =
		                new BufferedOutputStream(
		                		new FileOutputStream(f)
		                )
		        )
	    		{
	    			stream.write(json.getBytes());
	     
	    		} catch (Exception e) {
	    			error = "Upload failed " + "pruebaCanvas.png" + " => " + e.getMessage();
	    		}
        }
      
        return "/settings";
	}
    
	@GetMapping({"/", "/index"})
	public String root(Model model, Principal principal, HttpSession s) {
		
			log.info(principal.getName() + " de tipo " + principal.getClass());
		
			if (s.getAttribute("user") == null) {
				s.setAttribute("user", entityManager
						.createQuery("from User where nickname = :nickname", User.class)
	                    .setParameter("nickname", principal.getName())
	                    .getSingleResult());
				User u = (User) s.getAttribute("user");
				log.info(System.getProperty("user.dir"));
				File f = localData.getFile("users/" + s.getAttribute("user").toString(),"avatar.png");
				s.setAttribute("avatar", "users/1/avatar.png");
				
			}
			// org.springframework.security.core.userdetails.User

		return "home";
	}
	
	@GetMapping("/login")
	public String login(HttpSession s) {
		return "login";
	}
	
	@GetMapping("/logout")
	public String logout() {
		return "logout";
	}
	
	@GetMapping("/upload")
	public String upload() {
		return "upload";
	}
	
	@GetMapping("/results")
	public String results() {
		return "results";
	}
	
	@GetMapping("/playing")
	public String playing() {
		return "playing";
	}
	
	@GetMapping("/map-design")
	public String map_design() {
		return "map-design";
	}

	@GetMapping("/code-design")
	public String code_design() {
		return "code-design";
	}
	
	@GetMapping("/play")
	public String play(HttpSession s) {
		
		List<Code> codes = entityManager.createQuery("SELECT e FROM Code e", Code.class).getResultList();
		s.setAttribute("codes", codes);

		List<Map> maps = entityManager.createQuery("SELECT e FROM Map e", Map.class).getResultList();
		s.setAttribute("maps", maps);
		
		return "play";
	}
	
	@GetMapping("/profile")
	public String profile(HttpSession s) {
		User u = (User) s.getAttribute("user");
		s.setAttribute("codes", entityManager
				.createQuery("from Code where creator = :id", Code.class)
                .setParameter("id",  u).getResultList());
		
		List<Code> listaCodes = (List<Code>) s.getAttribute("codes");
		int sizeCodes = listaCodes.size();
		s.setAttribute("codeListSize", sizeCodes);
		
		s.setAttribute("maps", entityManager
				.createQuery("from Map where creator = :id", Map.class)
                .setParameter("id",  u).getResultList());
		
		List<Map> listaMaps = (List<Map>) s.getAttribute("maps");
		int sizeMaps = listaMaps.size();
		s.setAttribute("mapListSize", sizeMaps);
		
		return "profile";
	}
	
	@GetMapping("/settings")
	public String settings() {
		return "settings";
	}
	
	@GetMapping("/ranking")
	public String ranking(HttpSession s) {
		s.setAttribute("users", entityManager
				.createQuery("from User", User.class)
                .getResultList());
	
		return "ranking";
	}
	
	@GetMapping("/loadMap")
	public String loadMap(HttpServletRequest request,HttpServletResponse response) throws ServletException, IOException  

	// request is an object of type HttpServletRequest and it's used to obtain information
	// response is an object of type HttpServletResponse and it's used to generate a response
	// throws is used to specify the exceptions than a method can throw
	
	 {
		BufferedReader br = new BufferedReader(new FileReader(localData.getFile("maps", "1")));
		String everything = "";
		try {
		    StringBuilder sb = new StringBuilder();
		    String line = br.readLine();

		    while (line != null) {
		        sb.append(line);
		        sb.append(System.lineSeparator());
		        line = br.readLine();
		    }
		    everything = sb.toString();
		} finally {
		    br.close();
		}
		
		
	    response.setContentType("application/json");
	    PrintWriter info = response.getWriter();
	    info.println(everything);
	    info.close();
	    return "playing";
	    }
	
	@GetMapping("/loadCode")
	public String loadCode(HttpServletRequest request,HttpServletResponse response) throws ServletException, IOException  

	// request is an object of type HttpServletRequest and it's used to obtain information
	// response is an object of type HttpServletResponse and it's used to generate a response
	// throws is used to specify the exceptions than a method can throw
	
	 {
		BufferedReader br = new BufferedReader(new FileReader(localData.getFile("codes", "1")));
		String everything = "";
		try {
		    StringBuilder sb = new StringBuilder();
		    String line = br.readLine();

		    while (line != null) {
		        sb.append(line);
		        sb.append(System.lineSeparator());
		        line = br.readLine();
		    }
		    everything = sb.toString();
		} finally {
		    br.close();
		}
		
		
	    response.setContentType("text/plain");
	    PrintWriter info = response.getWriter();
	    info.println(everything);
	    info.close();
	    return "playing";
	    }
	
	@RequestMapping(value="/saveAvatar", method=RequestMethod.POST)
	public String handleFileUpload(@RequestParam("photo") MultipartFile photo, HttpSession s, HttpServletResponse response)
	{
		String error = "";
		if (photo.isEmpty()) {
			error = "Empty file uploading photo";
			log.error(error);
		} else {

			File f = localData.getFile("users/" + s.getAttribute("user").toString(),"avatar.png");
			try (BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(f))) {
				stream.write(photo.getBytes());
			} catch (Exception e) {
				error = "Upload failed " + s.getAttribute("user").toString() + " => " + e.getMessage();
				log.error(error);
			}
		}
	

		    return  "redirect:/profile";
	}
	

	@RequestMapping(value="/getAvatar", 
	method = RequestMethod.GET)
public void userPhoto(HttpSession s,
	HttpServletResponse response) {
File f = localData.getFile("user", s.getAttribute("user").toString());
try (InputStream in = f.exists() ? 
    	new BufferedInputStream(new FileInputStream(f)) :
    	new BufferedInputStream(this.getClass().getClassLoader()
    			.getResourceAsStream("unknown-user.jpg"))) {
	FileCopyUtils.copy(in, response.getOutputStream());
} catch (IOException ioe) {
	response.setStatus(HttpServletResponse.SC_NOT_FOUND); // 404
	log.info("Error retrieving file: " + f + " -- " + ioe.getMessage());
}
}
	
	
}